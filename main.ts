import { App, Plugin, PluginSettingTab, Setting, MarkdownView, Editor } from 'obsidian';
import * as CodeMirror from "codemirror";

interface PluginSettings {
	shouldRegex: boolean;
	regex: string;
	regexReplace: string;
}

const DEFAULT_SETTINGS: PluginSettings = {
	shouldRegex: false,
	regex: '',
	regexReplace: ''
}

interface EditorRange {
	start: { line: number; ch: number };
	end: { line: number; ch: number };
}

export default class OrderList extends Plugin {
	settings: PluginSettings;

	async onload() {
		await this.loadSettings();

		this.addCommand({
			id: 'replace-selection',
			name: 'Order selected list',
			editorCallback: () => this.findAndReplace()
		});

		this.addSettingTab(new SettingTab(this.app, this));
	}

	findAndReplace(): void {
		let editor = this.app.workspace.getActiveViewOfType(MarkdownView)?.editor;
		if (editor) {
			let selectedText = this.getSelectedText(editor);
			let lines = selectedText.split("\n");
			if (selectedText.includes("\n- ")) {
				let tempLines = selectedText.split("\n- ");
				lines = [];
				for (let i = 0; i < tempLines.length; i++) {
					if (i == 0) {
						lines.push(tempLines[i]);
					} else {
						lines.push("- " + tempLines[i]);
					}
				}
			} else if (selectedText.includes("\n* ")) {
				let tempLines = selectedText.split("\n* ");
				lines = [];
				for (let i = 0; i < tempLines.length; i++) {
					if (i == 0) {
						lines.push(tempLines[i]);
					} else {
						lines.push("* " + tempLines[i]);
					}
				}
			} else if (lines.length < 2 * selectedText.split("\n\n").length) {
				lines = selectedText.split("\n\n");
			}

			let linesList = [];
			for (let i = 0; i < lines.length; i++) {
				linesList.push([lines[i], this.evaluateLineValue(lines[i].split("\n")[0].split(" ").pop())]);
			}

			linesList.sort(function (a, b) { return a[1] - b[1] })

			selectedText = "";
			for (let i = 0; i < linesList.length; i++) {
				selectedText += linesList[i][0] + "\n";
			}

			editor.replaceSelection(selectedText);
		}
	}
	

	// getEditor(): CodeMirror.Editor {
	// 	return this.app.workspace.getActiveViewOfType(MarkdownView)?.editor;
	// }

	getSelectedText(editor: CodeMirror.Editor): string {
		if (!editor.somethingSelected())
			this.selectLineUnderCursor(editor);

		return editor.getSelection();
	}

	selectLineUnderCursor(editor: CodeMirror.Editor) {
		let selection = this.getLineUnderCursor(editor);
		editor.getDoc().setSelection(selection.start, selection.end);
	}

	getLineUnderCursor(editor: CodeMirror.Editor): EditorRange {
		let fromCh, toCh: number;
		let cursor = editor.getCursor();

		fromCh = 0;
		toCh = editor.getLine(cursor.line).length;

		return {
			start: { line: cursor.line, ch: fromCh },
			end: { line: cursor.line, ch: toCh },
		};
	}

	evaluateLineValue(line: string) {
		if (this.settings.shouldRegex == false) {
			try {
				return eval(line);
			} catch {
				return 999999;
			}
		} else {
			try {
				let re = new RegExp(this.settings.regex, '');
				return eval(line.replace(re, this.settings.regexReplace));

			} catch {
				return 999999;
			}
		}
	}


	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}



class SettingTab extends PluginSettingTab {
	plugin: OrderList;

	constructor(app: App, plugin: OrderList) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		let { containerEl } = this;

		containerEl.empty();

		containerEl.createEl('h2', { text: 'Order List Settings' });

		new Setting(containerEl)
			.setName("Use regex to evaluate line's number")
			.addToggle(cb => cb.onChange(value => {
				this.plugin.settings.shouldRegex = value;
				this.plugin.saveSettings();
			}).setValue(this.plugin.settings.shouldRegex));

		new Setting(containerEl)
			.setName("Add your own regex")
			.addText(cb => cb.onChange(value => {
				this.plugin.settings.regex = value;
				this.plugin.saveSettings();
			}).setValue(this.plugin.settings.regex));

		new Setting(containerEl)
			.setName("Replace")
			.addText(cb => cb.onChange(value => {
				this.plugin.settings.regexReplace = value;
				this.plugin.saveSettings();
			}).setValue(this.plugin.settings.regexReplace));
}
}