// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
let myStatusBarItem: vscode.StatusBarItem;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "sample" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  const hello = vscode.commands.registerCommand("sample.helloWorld", () => {
    // The code you place here will be executed every time your command is executed
    // Display a message box to the user
    vscode.window.showInformationMessage("Hello World from sample!");
  });

  const quickPick = vscode.commands.registerCommand("sample.quickPick", () => {
    vscode.window.showQuickPick(["pick1", "pick2"]).then((selected) => {
      if (selected) {
        vscode.window.showInformationMessage(selected);
      }
    });
  });

  const filePick = vscode.commands.registerCommand("sample.filePick", () => {
    vscode.window.showOpenDialog({}).then((inputFile) => {
      if (inputFile) {
        vscode.window.showInformationMessage(JSON.stringify(inputFile));
      }
    });
  });

  const outputChannel = vscode.commands.registerCommand(
    "sample.outputChannel",
    () => {
      const testOutput = vscode.window.createOutputChannel("TEST");
      testOutput.show();
      testOutput.appendLine("outputChannel");
      testOutput.show();
    }
  );

  const progress = vscode.commands.registerCommand("sample.progress", () => {
    vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: "I am long running!",
        cancellable: true,
      },
      (progress, token) => {
        token.onCancellationRequested(() => {
          vscode.window.showInformationMessage(
            "User canceled the long running operation"
          );
        });

        progress.report({ increment: 0 });

        setTimeout(() => {
          progress.report({
            increment: 10,
            message: "I am long running! - still going...",
          });
        }, 1000);

        setTimeout(() => {
          progress.report({
            increment: 40,
            message: "I am long running! - still going even more...",
          });
        }, 2000);

        setTimeout(() => {
          progress.report({
            increment: 50,
            message: "I am long running! - almost there...",
          });
        }, 3000);

        var p = new Promise((resolve) => {
          setTimeout(() => {
            resolve();
          }, 5000);
        });

        return p;
      }
    );
  });

  const dataStorage = vscode.commands.registerCommand(
    "sample.dataStorage",
    () => {
      context.workspaceState.update("test", "demo");
      vscode.window.showInformationMessage(
        JSON.stringify(context.workspaceState.get("test"))
      );
    }
  );

  const webview = vscode.commands.registerCommand("sample.webview", () => {
    // Create and show panel
    const panel = vscode.window.createWebviewPanel(
      "webview",
      "Webview Sample",
      vscode.ViewColumn.One,
      {}
    );

    // And set its HTML content
    panel.webview.html = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body>
        <img src="https://github.githubassets.com/images/spinners/octocat-spinner-128.gif" width="300" />
    </body>
    </html>`;
  });

  const myCommandId = "sample.statusBar";
  const statusBar = vscode.commands.registerCommand(myCommandId, () => {
    let n = getNumberOfSelectedLines(vscode.window.activeTextEditor);
    vscode.window.showInformationMessage(
      `Yeah, ${n} line(s) selected... Keep going!`
    );
  });

  // create a new status bar item that we can now manage
  myStatusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );
  myStatusBarItem.command = myCommandId;
  context.subscriptions.push(myStatusBarItem);

  // register some listener that make sure the status bar
  // item always up-to-date
  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor(updateStatusBarItem)
  );
  context.subscriptions.push(
    vscode.window.onDidChangeTextEditorSelection(updateStatusBarItem)
  );

  // update status bar item once at start
  updateStatusBarItem();

  context.subscriptions.push(hello);
  context.subscriptions.push(quickPick);
  context.subscriptions.push(filePick);
  context.subscriptions.push(outputChannel);
  context.subscriptions.push(dataStorage);
  context.subscriptions.push(progress);
  context.subscriptions.push(webview);
  context.subscriptions.push(statusBar);
}

function updateStatusBarItem(): void {
  let n = getNumberOfSelectedLines(vscode.window.activeTextEditor);
  if (n > 0) {
    myStatusBarItem.text = `$(megaphone) ${n} line(s) selected`;
    myStatusBarItem.show();
  } else {
    myStatusBarItem.hide();
  }
}

function getNumberOfSelectedLines(
  editor: vscode.TextEditor | undefined
): number {
  let lines = 0;
  if (editor) {
    lines = editor.selections.reduce(
      (prev, curr) => prev + (curr.end.line - curr.start.line),
      0
    );
  }
  return lines;
}
// this method is called when your extension is deactivated
export function deactivate() {}
