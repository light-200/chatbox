const template = document.createElement("template");
const textTemplate = document.createElement("template");
template.innerHTML = `
    <style>
        *{
            box-sizing: border-box;
        }

        .customProperties{
            --chatbox-width: 400px;
            --chatbox-height: 500px;
            --chatbox-radius: 5px;
            --chatbox-background: pink;
            --chatbox-font-family: monospace;

            --texts-gap: .0rem;

            --footer-height: 50px;
            --footer-radius: 100px;
            --footer-background: white;
            --footer-font-color: black; 
            --footer-font-size: 15px;
            --footer-element-gap: .2rem;

            --textSend-radius: 50px;
            --textSend-background: rgb(199, 225, 255); 
            --textSend-padding: 5px 10px;

            --text-background: aliceblue;
        }

       .chatbox {
        width: var(--chatbox-width, 300px);
        height: var(--chatbox-height, 350px);
        border-radius: var(--chatbox-radius, 0);
        display: flex;
        flex-direction: column;
        background: var(--chatbox-background, pink);
        font-family: var(--chatbox-font-family, monospace);
      }

      .texts {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: var(--texts-gap, 0);
        overflow: auto;
      }

      .footer {
        display: flex;
        margin: 0.2rem;
        padding: 0.2rem;
        padding-left: 1rem;
        height: var(--footer-height, 50px);
        border-radius: var(--footer-radius, 100px);
        background: var(--footer-background, white);
        gap: var(--footer-element-gap, .2rem);
        font-size: var(--footer-font-size, 15px);
        color: var(--footer-font-color, black);
      }
      
      .footerText {
        flex: 1;
        border: none;
        background: none;
      }

      .footerText:active,.footerText:focus {
        outline: none;
        border: none;
      }

      .footerMenu {
        width: max-content;
        display: flex;
        align-items: center;
        gap: .2rem;
      }

      .textSend {
        display: grid;
        place-content: center;

        width: max-content;
        height: 100%;
        padding: var(--textSend-padding, 5px 10px);

        border-radius: var(--textSend-radius, 50px);
        background: var(--textSend-background, rgb(199, 225, 255));

        user-select: none;
        cursor: pointer;
      }

      .textSend:active{
        filter: brightness(90%);
      }

      
      ::-webkit-scrollbar {
        display: none;
      } 
    </style>
    <div class="chatbox customProperties">
        <div class="texts">
            <slot />
        </div>
        <div class="footer">
            <input class="footerText" placeholder="send text..."></input>
            <div class="footerMenu">
                <div class="textSend">Send</div>
            </div>
        </div>
    </div>
`;

textTemplate.innerHTML = `
        <style>
            /* texts styling  */

            .text {
                height: max-content;
                display: flex;
                position: relative;
                align-items: center;
                font-size: var(--footer-font-size, 15px);
                gap: 0.2rem;
                padding: .2rem;
            }

            .pfp {
                font-size: 15px;
                display: grid;
                place-content: center;
                width: 5ch;
                height: 5ch;
                border-radius: 100%;
                overflow: hidden;
            }

            .sent {
                justify-content: right;
                flex-direction: row-reverse;
                text-align: right;
            }

            .sent .textmsg {
                border-radius: 20px;
                border-top-right-radius: 0;
            }

            .textmsg {
                max-width: 70%;
                padding: 0.5rem;
                background: var(--text-background, white);
                border-radius: 20px;
                border-top-left-radius: 0;
                overflow-wrap: break-word;
                white-space: pre-wrap;
            }
        </style>
        <div class="text">
          <span class="pfp"></span>
          <span class="textmsg"></span>
        </div>
`;

var customProperties = [
  "--chatbox-width",
  "--chatbox-height",
  "--chatbox-radius",
  "--chatbox-background",
  "--chatbox-font-family",
  "--texts-gap",
  "--footer-height",
  "--footer-radius",
  "--footer-background",
  "--footer-font-color",
  "--footer-font-size",
  "--footer-element-gap",
  "--textSend-radius",
  "--textSend-background",
  "--textSend-padding",
  "--text-background",
];

class Chatbox extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    let chatbox = this.shadowRoot.querySelector(".customProperties");

    customProperties.forEach((property) => {
      let attribute = property.slice(2);
      let attributeValue = this.getAttribute(attribute);
      if (attributeValue) {
        chatbox.style.setProperty(property, attributeValue);
      }
    });
  }

  connectedCallback() {
    const textInput = this.shadowRoot.querySelector(".footerText");
    const sendBtn = this.shadowRoot.querySelector(".textSend");
    let sendBtnDisable = true;

    textInput.addEventListener("input", () => {
      this.dispatchEvent(new Event("typing"));
      checkText();
    });

    textInput.addEventListener("keyup", (e) => {
      if (e.keyCode === 13) {
        e.preventDefault();
        sendBtn.click();
      }
    });

    sendBtn.addEventListener("click", () => {
      if (sendBtnDisable) return;

      let msg = (this.msg = textInput.value);

      this.handleMsg({ username: "you", msg }, true);

      textInput.value = "";
      sendBtnDisable = true;

      this.dispatchEvent(new Event("send"));
    });

    function checkText() {
      //checks if the text is empty
      let regex = /[^ ]/g;
      if (textInput.value == null) sendBtnDisable = true;
      if (textInput.value.match(regex)) {
        sendBtnDisable = false;
      } else {
        sendBtnDisable = true;
      }
    }
  }

  handleMsg({ username, msg }, sent) {
    const textArea = this.shadowRoot.querySelector(".texts");

    let text = textTemplate.content.cloneNode(true);
    text.querySelector(".textmsg").innerText = msg;
    text.querySelector(".pfp").innerText = username;

    if (sent) text.querySelector(".text").classList.add("sent");
    else text.querySelector(".text").classList.add("receive");

    this.shadowRoot.querySelector(".texts").appendChild(text);

    textArea.scrollTop = textArea.scrollHeight;
  }
}

window.customElements.define("chat-box", Chatbox);
