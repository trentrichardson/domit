# Domit - Small DOM Utility Library

A small module library to provide some basic dom utilities.  CommonJS, AMD, and old school compatible.  That means it will work with browserfy, requirejs, moonboots, or just an old school script tag in your page.

To install run in your project:
```
npm install domit --save
```
Or with a script tag or requirejs.

---
## About
- Author: [Trent Richardson](http://trentrichardson.com)
- Github: [Repo](https://github.com/trentrichardson/domit)
- Licensed under the [MIT](LICENSE)

---
## Methods

### domit.event(name, data)
Create a javascript event object with the provided data.
- `name` - String - name of the event. Do not include "on" ex: "onclick".
- `data` - Object - any data to include into the event.
Return native event object.

### domit.query(selector[, scope])
A way to use css selectors to select a list of elements.  This will return a subclass with chainable methods.  
- `selector` - String, NodeList, Node - css selector, a node list, or a single element.
- `scope` - Node - Dom element to search from. Defaults to document.

Return a subclass with the following methods and properties.

#### .find(selector)
Searches the collection with the given selector, returning a new selection subclass.
- `selector` - String - css selector.
Return a new selection class of the found Nodes.

#### .attach(parent, how, where)
Attaches the current subclass' collection into the parent node, beside the `where` node.
- `parent` - Node - an html node element to attach to.
- `how` - String - "append" or "prepend".
- `where` - Node - Node to insert the new node before or after.
Return the current selection.

#### .neighbor(where)
Get the sibling element, not necessarily in the subclass' collection but the overall dom.
- `where` - String - previous or next.
Return a new selection class of the found Node.

#### .each(fn)
Loop over each element in the collection.
- `fn` - Function - the callback function for each node.
Return the collection class.

#### .data(props)
Get or Set data attributes on all elements in the selection.
- `props` String, Object - string of property name to get, a hash of key/values to set.
Return the property on get, the selection class on set.

#### .offset()
Get the offset of an element from the overall document x/y.
Return an Object like {x: 123, y: 123} relative to the document, not the parent.

#### .css(props)
Get or set the css properties on all nodes in collection.
- `props` - String, Object - string of property name to get, a hash of key/values to set.
Return the property on get, the selection class on set.

#### .cls(action, cls)
Work with class names on all nodes in collection.
- `action` - String - has, add, delete.
- `cls` - String - the class name to add, delete, has.
Return Boolean when action=has, otherwise returns the selection class.

#### .animate(props, duration, fn)
Animate the collection of elements. This is basic linear animation, don't expect too much here.
`props` - Object - key/value pairs of css properties to animate to.
`duration` - Int - milliseconds to animate.
`fn` - Function - callback when done.
Return the selection class.

#### .serialize()
Serialize the collection's form fields into an object.  Checkboxes, select[multiple], and any inputs with duplicate names will return an array of values.
Returns an object where keys are the field's name.

#### .on(type, fn)
Attach an event to the node collection.
`type` - String - name of the event to attach.
`fn` - Function - the event handler function.
Return the selection class.

#### .off(type, fn)
Remove an event from the node collection.
`type` - String - name of the event to attach.
`fn` - Function - the event handler function.
Return the selection class.

#### .trigger(ev, isCustom)
Trigger an event to the node collection.
- `type` - Event/String - name of the event trigger or an Event object.
- `isCustom` - Boolean - whether this is a custom event or native.
Return the selection class.

