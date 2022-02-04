## Chatbox

Chatbox helps you make a simple messenger app. Customize it to fit your website.

## Usage

Install the package using npm

```bash
npm i @light-200/chatbox
```

Import in your javascript file

```javascript
import "@light-200/chatbox";
```

The custom element is called

```HTML
<chat-box> </chat-box>
```

Change default values using attributes

```HTML
<chat-box chatbox-background="aliceblue"></chat-box>
```

## event handlers

- handleMsg({username,msg})

  > for showing text message

- event "send" and message will be in event.target.msg

  > use this to process sent message

### Custom properties

```bash
chatbox-width
chatbox-height
chatbox-radius
chatbox-background
chatbox-font-family
texts-gap
footer-height
footer-radius
footer-background
footer-font-color
footer-font-size
footer-element-gap
textSend-radius
textSend-background
textSend-padding
text-background
```

## Contributing

create issues or work on existing
