Compatibility check and testing for Responsive Design (materialize)

### Notification from ioBroker Check and Service Bot
Dear Adapter developer,

ioBroker should be fully usable and operable on mobile devices

**So please check your Materialize or React based Adapter for Responsive Design.**
You can perform these tests in the developer console of your browser (F12).

Future additions and corrections to this issue will be published at the responsive-design-initiative repository. Please check https://github.com/iobroker-community-adapters/responsive-design-initiative?tab=readme-ov-file#responsive-design-initiative for updates.

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

### Integration of css and js files
It is also important that the following js and css files are included in index_m.html or tab_m.html

````
<!-- Load ioBroker scripts and styles -->
<link rel="stylesheet" type="text/css" href="../../lib/css/fancytree/ui.fancytree.min.css" />
<link rel="stylesheet" type="text/css" href="../../css/adapter.css" />
<link rel="stylesheet" type="text/css" href="../../lib/css/materialize.css">

<script type="text/javascript" src="../../lib/js/jquery-3.2.1.min.js"></script>
<script type="text/javascript" src="../../socket.io/socket.io.js"></script>

<script type="text/javascript" src="../../lib/js/materialize.js"></script>
<script type="text/javascript" src="../../lib/js/jquery-ui.min.js"></script>
<script type="text/javascript" src="../../lib/js/jquery.fancytree-all.min.js"></script>

<script type="text/javascript" src="../../js/translate.js"></script>
<script type="text/javascript" src="../../lib/js/selectID.js"></script>
<script type="text/javascript" src="../../js/adapter-settings.js"></script>
<script type="text/javascript" src="words.js"></script>
````

Adapter-settings.js and adapter.css are very important for a responsive design. These files are provided and maintained by the admin.

---

Please close the issue after you checked it.

Feel free to contact me (@iobroker-bot) if you have any questions.

And **THANKS A LOT** for maintaining this adapter from me and all users.  
_Let's work together for the best user experience._

your  
_ioBroker Check and Service Bot_

@simatec for evidence

Note: If you added Responsive Design tests already, simply close this issue.
