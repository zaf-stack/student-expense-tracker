---
description: How to upload (push) changes to GitHub
---

Follow these steps to upload your latest code changes to GitHub.

1.  **Check Status**
    See which files have changed.
    ```powershell
    git status
    ```

2.  **Add Changes**
    Stage all your modified files for upload.
    ```powershell
    git add .
    ```

3.  **Commit Changes**
    Save your changes with a descriptive message.
    *Replace "Update features" with a short summary of what you did.*
    ```powershell
    git commit -m "Enhanced PhonePe Import: AI categorizations, Mobile UI, and Dashboard fixes"
    ```

4.  **Push to GitHub**
    Upload the committed changes to the cloud.
    ```powershell
    git push
    ```

> **Note:** If `git push` fails, you might need to pull latest changes first: `git pull`
