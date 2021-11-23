package internal

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
	"os"
	"os/exec"
	"path"
	"strings"
)

// split the repo to two parts by "#"
// the first part is repo name
// the second part is branch name or tag name
func ParseRepo(repo string) (string, string) {
	parts := strings.Split(repo, "#")
	if len(parts) == 1 {
		return parts[0], ""
	}
	return parts[0], parts[1]
}

func FetchRepo(args *AppArgs) error {
	// parse the repo to two parts
	repo, version := ParseRepo(args.repo)

	if version == "" {
		defaultBranch, err := getDefaultBranchFromGitHubApi(repo)
		if err != nil {
			return err
		}
		version = *defaultBranch
	}

	if !args.force {
		exists, err := pathExists(args.destination)
		if err != nil {
			return err
		}
		if exists {
			if !isEmptyDir(args.destination) {
				return fmt.Errorf("destination directory is not empty, use --force to continue")
			}
		}

	}

	// Get GitHub repo archive URL from repo and branch
	url := fmt.Sprintf("https://codeload.github.com/%s/tar.gz/refs/heads/%s", repo, version)
	fmt.Println("Downloading from", url)

	err := downloadFileFromUrlAndExtract(url, args.destination, args.subpath)

	return err
}

func downloadFileFromUrlAndExtract(url string, destination string, subpath string) error {
	// Download the file from `url` and save it to a temp file
	res, err := http.Get(url)
	if err != nil {
		return err
	}
	defer res.Body.Close()

	// Create a temp file
	tmpFile, err := ioutil.TempFile("", "")
	if err != nil {
		return err
	}
	defer tmpFile.Close()

	// Write the body to file
	_, err = io.Copy(tmpFile, res.Body)
	if err != nil {
		return err
	}

	// Extract the archive to the destination
	err = extract(tmpFile.Name(), destination, subpath)

	return err

}

// using command `tar` to extract file
func extract(src, dest string, subpath string) error {
	tempDir, err := ioutil.TempDir("", "")
	if err != nil {
		return err
	}
	os.MkdirAll(tempDir, 0755)
	// Create the command
	out, err := exec.Command("tar", "-xvzf", src, "-C", tempDir, "--strip-components", "1").CombinedOutput()

	if err != nil {
		return errors.New(string(out))
	}

	// Move temp dir to destination
	fromDir := tempDir
	if subpath != "" {
		fromDir = path.Join(tempDir, subpath)
	}
	err = os.Rename(fromDir, dest)

	if err != nil {
		return err
	}

	return nil
}

func isEmptyDir(dir string) bool {
	files, err := ioutil.ReadDir(dir)
	if err != nil {
		return false
	}
	return len(files) == 0
}

func pathExists(path string) (bool, error) {
	_, err := os.Stat(path)
	if err == nil {
		return true, nil
	}
	if os.IsNotExist(err) {
		return false, nil
	}
	return true, err
}

func getDefaultBranchFromGitHubApi(repo string) (*string, error) {
	res, err := http.Get("https://api.github.com/repos/" + repo)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()

	// Read the body
	body, err := ioutil.ReadAll(res.Body)
	if err != nil {
		return nil, err
	}
	// Read body as JSON
	var data map[string]interface{}
	err = json.Unmarshal(body, &data)
	if err != nil {
		return nil, err
	}
	// Get the default branch
	defaultBranch := data["default_branch"].(string)
	return &defaultBranch, nil
}
