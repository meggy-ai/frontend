# Deployment Guide - Windows Task Scheduler

This guide will help you set up the Meggy WebApp to run automatically on Windows startup using Task Scheduler.

## Prerequisites

1. Node.js installed
2. Dependencies installed (`npm install`)
3. Application built (`npm run build`)

## Setup Instructions

### Step 1: Build the Application

```powershell
cd C:\src\meggy\webapp
npm run build
```

### Step 2: Test the Production Build

```powershell
npm start
```

Verify it runs at http://localhost:3000

### Step 3: Create a Task in Task Scheduler

1. **Open Task Scheduler**
   - Press `Win + R`
   - Type `taskschd.msc` and press Enter

2. **Create Basic Task**
   - Click "Create Basic Task..." in the right panel
   - Name: `Meggy WebApp`
   - Description: `Start Meggy AI Web Application`
   - Click "Next"

3. **Trigger**
   - Select "When the computer starts"
   - Click "Next"

4. **Action**
   - Select "Start a program"
   - Click "Next"

5. **Program/Script Settings**
   - **Program/script**: `powershell.exe`
   - **Add arguments**: `-ExecutionPolicy Bypass -WindowStyle Hidden -File "C:\src\meggy\webapp\start-meggy.ps1"`
   - **Start in**: `C:\src\meggy\webapp`
   - Click "Next"

6. **Finish**
   - Check "Open the Properties dialog for this task when I click Finish"
   - Click "Finish"

7. **Advanced Settings** (in Properties dialog)
   - Go to "General" tab:
     - Check "Run whether user is logged on or not" (optional, requires password)
     - Check "Run with highest privileges" (if needed)
   - Go to "Conditions" tab:
     - Uncheck "Start the task only if the computer is on AC power" (for laptops)
   - Go to "Settings" tab:
     - Check "Allow task to be run on demand"
     - Check "If the task fails, restart every: 1 minute"
     - Set "Attempt to restart up to: 3 times"
   - Click "OK"

### Step 4: Test the Task

Right-click on "Meggy WebApp" task and select "Run"

### Step 5: Verify

Open http://localhost:3000 in your browser

## Alternative: Using PM2 (Simpler Option)

If you prefer a simpler approach without Task Scheduler:

```powershell
# Install PM2 globally
npm install -g pm2

# Build the app
npm run build

# Start with PM2
pm2 start npm --name "meggy-webapp" -- start

# Save the PM2 process list
pm2 save

# Generate startup script (run as Administrator)
pm2 startup

# Copy and run the command that PM2 outputs
```

## Changing the Port

To run on a different port, edit `start-meggy.ps1`:

```powershell
$env:PORT = "8080"
npm start
```

## Stopping the Application

### Task Scheduler Method:

- Open Task Scheduler
- Right-click "Meggy WebApp" → "End"
- Or find the node.exe process in Task Manager and end it

### PM2 Method:

```powershell
pm2 stop meggy-webapp
pm2 delete meggy-webapp
```

## Logs

### Task Scheduler:

- View logs in Task Scheduler → History tab
- Or check Event Viewer

### PM2:

```powershell
pm2 logs meggy-webapp
```

## Troubleshooting

### Application won't start:

1. Ensure you've run `npm run build` first
2. Check that Node.js is in the system PATH
3. Verify the script path in Task Scheduler is correct
4. Run the PowerShell script manually to see errors

### Port already in use:

- Change the port in `start-meggy.ps1`
- Or stop the conflicting process

### Task Scheduler shows "The task has not yet run":

- Right-click the task and select "Run"
- Check the task conditions and settings
