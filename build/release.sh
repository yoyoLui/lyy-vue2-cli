git checkout master
git merge dev

#!/usr/bin/env sh
set -e
echo "Enter release version: "
read VERSION

read -p "Releasing $VERSION - are you sure? (y/n)" -n 1 -r
echo    # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]
then
  # commit
  git commit -am "[release] $VERSION"
  git tag v$VERSION

  # publish
  git push origin master
  git push origin refs/tags/v$VERSION
  git checkout dev
  git rebase master
  git push origin dev

  npm publish
fi
