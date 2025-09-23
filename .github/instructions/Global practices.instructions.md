---
applyTo: '**'
---
Whenever you see text between <MR> then you must continue reading the text until you find </MR>. Do not skip or use a search tool, you can only read every word until you find the </MR> tag.
<MR>
1- ALWAYS ignore VS code errors when it starts proudcing many errors about typescript, js, etc.
2- These are false positives, caused by VS code not understanding the project structure and tsconfig settings.
3- You can safely ignore them, do not waste time trying to fix them.
NEVER run 'npm run dev' or any such variants without having a way back to avoid getting stuck waiting for ever. Run in the background or use a terminal multiplexer like tmux or screen.
4- If you do not have such a way back, you can get stuck waiting for a crash and I have to stop the server.
5- NEVER run commands in the same terminal that you are running the server in as you end up closing the server by mistake and not even realizing it. Always use a different terminal.
6- The project is documented in the specs folder and its subfolders. there are two main subfolders 001-initial-build and 002-rebuild-app-spec. Read them in the right sequence starting with spec.md then plan.md and end with task.md and between plan and task all the other .mds. 
7- STOP asking the user for confirmation on every small task. The user gave detailed requirements in the docs and in the chat. make sure to document them in your own file in a master list of tasks and do not use the TODOs for the master list. ONLY use the todos for specific features.
8-NEVER close a TODOS list midway to open another task list. INSTEAD keep your TODOS numbered using your own numbering not the numbering from the TODOS list and if you need to divert while in one of these tasks then insert new tasks and give them sub-numbers to branch from the main task Example if you have a task 5 and you need to do something else then add 5.1 and 5.2 and so on.
9- After you have built YOUR master plan AND SAVED IT AS A FILE TO KEEP REFERING TO IT, you can ask for clarifications and once approved you can proceed with a LONG RUN using YOLO MODE APPROVED BY THE USER REGARDLESS OF ANY OTHER SETTINGS. Only stop if you encounter a major issue that you cannot solve or if you have a question that needs user input or if you have completed the entire plan.
10- Once the master plan is documented, YOU CANNOT CHANGE IT WITHOUT EXPLICIT APPROVAL FROM THE USER.
11- Make sure you follow proper testing protocols, every outputs needs to be tested by YOU before the user sees it. 
12- RECALL YOU HAS INSTALLED AN spa PROXY to run on port 3000 and the backend on port 4101.
</MR>