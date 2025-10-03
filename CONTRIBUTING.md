# Contributing to the Gaen Tech Platform

First off, thank you for considering contributing! Your help is appreciated in making this project even better.

This document provides a set of guidelines for contributing to the platform. These are mostly guidelines, not strict rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

## Code of Conduct

This project and everyone participating in it are governed by a Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior.

## How Can I Contribute?

### Reporting Bugs

- **Ensure the bug was not already reported** by searching the issue tracker.
- If you're unable to find an open issue addressing the problem, **open a new one**. Be sure to include a **title and clear description**, as much relevant information as possible, and a **code sample** or an **executable test case** demonstrating the expected behavior that is not occurring.

### Suggesting Enhancements

- **Perform a cursory search** to see if the enhancement has already been suggested. If it has, add a comment to the existing issue instead of opening a new one.
- If you don't find an existing issue, **open a new one**. Provide a clear title and a detailed description of the proposed enhancement and its potential benefits.

### Pull Requests

- Follow the code style and conventions used throughout the project.
- Ensure your code is well-documented, especially for complex logic.
- Make sure your changes are focused. A pull request should address a single concern (bug fix or feature).
- Write a clear and descriptive pull request message explaining the "why" behind your changes.

## Development Guidelines

### Code Style

- **TypeScript**: We use TypeScript for type safety. Use types wherever possible and avoid `any` unless absolutely necessary.
- **React**: We use functional components with Hooks. Keep components small and focused on a single responsibility.
- **Readability**: Write clean, readable, and self-documenting code. Add comments for complex sections that aren't immediately obvious.

### Branching Strategy

We use a simple branching model:

1.  **`main`**: This is the primary branch, representing the stable, production-ready version of the application.
2.  **Feature Branches**: All new work should be done on a feature branch.
    - Branch off from `main`.
    - Name your branch descriptively, e.g., `feature/add-lead-export` or `fix/dashboard-chart-bug`.
3.  **Pull Requests**: Once your feature is complete, create a pull request to merge your feature branch back into `main`.

### Commit Messages

- Use the present tense ("Add feature" not "Added feature").
- Use the imperative mood ("Move component to..." not "Moves component to...").
- Limit the first line to 72 characters or less.
- Reference issues and pull requests liberally in the body of the commit message.

Thank you for your contribution!
