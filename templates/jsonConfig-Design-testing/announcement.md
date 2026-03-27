Compatibility check and testing for Responsive Design (jsonConfig)

### Notification from ioBroker Check and Service Bot
Dear Adapter developer,

ioBroker should be fully usable and operable on mobile devices

So please check your adapter jsonConfig for Responsive Design.
You can perform these tests in the developer console of your browser (F12)


---

For jsonConfig, all resolutions should be taken into account in the respective inputs.

The following resolutions are provided:
* xl - width in 1/12 of screen on extra large screens (1536px < width)
* lg - width in 1/12 of screen on large screens (1200px <= width < 1536px)
* md - width in 1/12 of screen on middle screens (900px <= width < 1200px)
* sm - width in 1/12 of screen on small screen (600px <= width < 900px)
* xs - width in 1/12 of screen on tiny screens (width < 600px)

### We recommend the following values for the standard layout

````
"xs": 12,
"sm": 12,
"md": 6,
"lg": 4,
"xl": 4
````

### The following entry should be made below ` "type": "tabs"` in order to display a clearly legible table bar:

````
"tabsStyle": {
  width: "calc(100% - 100px)"
},
````

---

Please close the issue after you checked it.

Feel free to contact me (@iobroker-bot) if you have any questions.

And **THANKS A LOT** for maintaining this adapter from me and all users.  
_Let's work together for the best user experience._

your  
_ioBroker Check and Service Bot_

@simatec for evidence

Note: If you added Responsive Design tests already, simply close this issue.
