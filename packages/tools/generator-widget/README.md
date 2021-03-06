# Pluggable Widgets Generator

![npm version](https://badge.fury.io/js/%40mendix%2Fgenerator-widget.svg)
![Mendix 8](https://img.shields.io/badge/mendix-8.0.0-brightgreen.svg)
![Build Status](https://travis-ci.org/mendix/widgets-resources.svg?branch=master)
![npm](https://img.shields.io/npm/dm/@mendix/generator-widget)
![GitHub release](https://img.shields.io/github/release/mendix/widgets-resources)
![GitHub issues](https://img.shields.io/github/issues/mendix/widgets-resources)

> [Yeoman](http://yeoman.io) generator for Mendix Pluggable Widgets.

## About

This generator uses the Yeoman scaffolding tool to let you quickly create a [Mendix Pluggable Widget](https://docs.mendix.com/howto/extensibility/pluggable-widgets).

---

## Installation

First, install [Yeoman](http://yeoman.io) and @mendix/widget using [npm](https://www.npmjs.com/) (we assume you have pre-installed [node.js](https://nodejs.org/)).

```bash
npm install -g yo
npm install -g @mendix/generator-widget
```

---

Then generate your new project inside an empty folder:

```bash
yo @mendix/widget
```

or automatically create the folder using:

```bash
yo @mendix/widget widget name
```

## Scaffold a widget

### 1. Provide the following information about your widget:

The following information needs to be provided about your widget:

-   name
-   description
-   organization
-   copyright
-   license
-   version
-   author
-   Mendix Project path
-   programming language
-   platform

Press <Enter> if you want to skip and use default values.

### 2.1. Using the task runner

The widget generator will include the necessary files and tasks to your package.json for running the tasks over The Pluggable Widgets Tools.

If necessary you can run the tasks using the commands

```bash
npm start
```

```bash
npm run build
```

```bash
npm run release
```

---

For more information, visit our [Mendix Pluggable Widget Tools repository](https://github.com/mendix/widgets-resources/tree/master/packages/tools/pluggable-widgets-tools).

### 2.2. Which template do you want to use for the widget?

#### Full boilerplate

The full widget boilerplate is a fully developed and tested Mendix React widget that shows a value as a badge or a color label (just available for web/responsive platform).
It has the following features:

-   Display as a badge or a color label
-   Attach actions to onClick event
-   Set static data text when the dynamic data is not specified

#### Empty widget

The empty template is a Mendix React hello world widget recommended for more experienced developers.

### 2.3 Add unit tests for the widget ?

If `Yes` is selected, unit tests are included to ensure individual units of the component are tested to determine whether they are fit for use. Default value is `No`.

### 2.4 Add end to end tests for the widget ?

If Yes is selected, end to end tests are included to ensure that the integrated components of an application function as expected. Default value is `No`.

Note: Both `Unit` and `End to end` tests apply only to the Full Boilerplate. `End to End` is exclusive for web and hybrid mobile apps.

The tool will then create copied files, and run `npm install` to install development dependencies.

### NOTE

To use the webpack-dev-server while developing:

-   Start Mendix Studio Pro from your Mendix project path or by default `/dist/MxTestProject` and run:

```bash
npm start
```

-   If you are running the generator through multiple operating systems (e.g. running a virtualized OS with Parallels on MacOS or any other virtualization software), make sure you have the right privileges and use the same OS for generation and file manipulation.

## Issues

Issues can be reported on [Github](https://github.com/mendix/widgets-resources/issues).
