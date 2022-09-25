# Order List

This plugin for [Obsidian](https://obsidian.md/) adds an "Order selected list" command. This will take the selected list and order it by the number at the end.

## How to configure

Assign a hotkey to "Order selected list" command.

## How to use

- Select any list in the editor, with or without bullet points.
- Run the command "Order selected list" from the command palette (or the hotkey you assigned).

### Examples

**Reorder list without bullet points:**

```markdown
replace blinds 10
clean my room 5
buy a new shelf 6
get new boxes 7
```

becomes 

```markdown
clean my room 5
buy a new shelf 6
get new boxes 7
replace blinds 10
```
**Reorder list with * bullet points**:

```markdown
* replace blinds 10
* get new boxes 7
* clean my room 5
* buy a new shelf 6
```

becomes 

```markdown
* clean my room 5
* buy a new shelf 6
* get new boxes 7
* replace blinds 10
```


**If there are sub-items, they will be moved along with the top level item**:

```markdown
- replace blinds 7/2
- buy a new shelf 6/100
	- sub-item
- get new boxes 4/2
- clean my room 5/6
	- test
	- second thing
```

becomes 

```markdown
- buy a new shelf 6/100
	- sub-item
- clean my room 5/6
	- test
	- second thing
- get new boxes 4/2
- replace blinds 7/2
```

Note that the plugin also ordered the properly even when the numbers at the end are not integers.