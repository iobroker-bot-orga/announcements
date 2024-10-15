Compatibility check and testing for Responsive Design

### Notification from ioBroker Check and Service Bot
Dear Adapter developer,

ioBroker should be fully usable and operable on mobile devices

So please check your Materialize Adapter for Responsive Design.
You can perform these tests in the developer console of your browser (F12)


---

For adapters in the Materialize design, important classes for the correct resolution should also be used for mobile devices.

### List of classes for different display sizes:

* lx - width in 1/12 of screen on large screens (1200px <= width < 1536px)
* mx - width in 1/12 of screen on middle screens (900px <= width < 1200px)
* sx - width in 1/12 of screen on small screen (600px <= width < 900px)

The recommended values for a `<div>` are as follows:

````
<div class="col s12 m6 l4">
````

The classes s,m and l must be configured in each `<div>`.

### Custom css for the mobile resolution

If you use your own CSS styles in your adapters, you should define the necessary values for the mobile resolution in the area. The area must be listed as follows in the CSS:

````
/* Style for small Screens */
@media screen and (max-width: 768px) {
  here your input...
}
````

````
/* Style for very small Screens */
@media screen and (max-width: 600px) {
  here your input...
}
````

---

Please close the issue after you checked it.

Feel free to contact me (@iobroker-bot) if you have any questions.

And THANKS A LOT for maintaining this adapter from me and all users. Let's work together for the best user experience.

your ioBroker Check and Service Bot

@simatec for evidence

Note: If you added Responsive Design tests already, simply close this issue.
