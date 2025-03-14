# stackinspector
chrome extension for enriching google search results with best matching stackoverflow question and answer.

# achievements
## featured in the chrome store for following best practices
[](./images/featured.png)

# load in browser to test unpacked
- open chrome browser 
- go to chrome://extensions
- press "Load unpacked" 
- select the root directory of the extension

# release
- make sure manifest has new version defined
- zip the dir "stackinspector" from the dir where "versions" dir is defined
- add it to versions 
- name it after the corresponding version in manifest
- push changes
- go to the "chrome webstore developer dashboard"
- select the extension
- select package
- select upload new package
- select the new zip file
- select send to review
- check "chrome webstore developer dashboard" state column (it should now say "awaiting review")
- celebrate with a cup of coffee


