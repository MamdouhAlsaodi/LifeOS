# LifeOS
LifeOS is a flexible productivity system designed to manage your work, life, and goals without rigid schedules. Plan smarter, focus better, and track progress across all areas of your life.
# LifeOS: The Holistic Productivity System

**LifeOS** is a comprehensive, domain-based productivity framework designed for founders, programmers, and high-performers. It moves beyond simple to-do lists to offer a full operating system for your life, focusing on execution, energy management, and multi-horizon planning.

## 🚀 Key Features

- **Domain-Based Organization**: Manage your life across multiple identities (Programmer, Founder, Company, Personal, Family). Each domain has its own dedicated system.
- **Eisenhower Matrix**: Prioritize tasks effectively into *Do* (Urgent/Important), *Decide* (Strategy), *Delegate*, and *Delete*.
- **Deep Focus Zone**: Integrated Pomodoro timer linked to your tasks to maintain flow state and track execution time.
- **Horizon Planning**: A 4-tiered planning system:
    - **Yearly Vision**: Define your "North Star" and major milestones.
    - **Quarterly Strategy**: Break milestones into actionable objectives.
    - **Weekly Sprints**: Move tasks from the backlog into your current week's focus.
    - **Daily Routines**: A 24-hour grid to map out your ideal high-performance day.
- **Privacy First**: 100% local data storage (LocalStorage). Your data never leaves your browser.
- **Data Portability**: Built-in Export and Import functionality via JSON files for easy backups.
- **PWA Ready**: Offline functionality with Service Workers, installable on mobile and desktop.
- **Adaptive UI**: Modern, sleek interface with full Dark Mode support and responsive design.

## 🛠 Technology Stack

- **React 19**: Utilizing the latest UI patterns.
- **Tailwind CSS**: Utility-first styling for a fast, responsive, and beautiful interface.
- **Lucide React**: Premium iconography for a clean visual language.
- **ES Modules**: Leverages `esm.sh` for a lightweight, no-build-step development experience.
- **Service Workers**: Enables PWA capabilities and offline reliability.

## 📖 Getting Started

### Installation
1. Clone this repository to your local machine.
2. Serve the root directory using a local web server (e.g., `npx serve` or the "Live Server" extension in VS Code).
3. Open the provided local URL in your browser.

### Basic Workflow
1. **Define Your Vision**: Go to **Planning > Year** and write down what you want to achieve.
2. **Set Objectives**: Move to **Planning > Quarter** to define the strategy for the current 3-month block.
3. **Manage Tasks**: Use the **Domain Views** to add tasks to the Eisenhower Matrix.
4. **Sprint Planning**: Use **Planning > Week** to drag tasks from your backlog into your active week.
5. **Execute**: Use the **Focus Zone** to complete tasks using the Pomodoro technique.
6. **Track Habits**: Check off your daily "Habit Stack" on the Dashboard to build consistency.

## 🛡 Privacy & Security
LifeOS is designed to be entirely client-side. There is no backend server and no cloud tracking. All data is stored in your browser's `localStorage`. To ensure your data is never lost, it is recommended to use the **Export Backup** feature in the Settings menu regularly.

## ⚖️ License
This project is open-source and available under the MIT License. Feel free to fork it and build your own custom LifeOS!
