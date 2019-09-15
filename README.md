## Laser ray casting

A scene that shows how [ray casting](https://docs.decentraland.org/development-guide/raycasting/) can be used to trace an imaginary line in space and check for object collision.


![](screenshot/screenshot.png)


[Explore the scene](https://laser-ray-cast.decentraland1.now.sh): this link takes you to a copy of the scene deployed to a remote server where you can interact with it just as if you were running `dcl start` locally.


**Install the CLI**

Download and install the Decentraland CLI by running the following command

```bash
npm i -g decentraland
```

For a more details, follow the steps in the [Installation guide](https://docs.decentraland.org/documentation/installation-guide/).


**Previewing the scene**

Once you've installed the CLI, download this example and navigate to its directory from your terminal or command prompt.

_from the scene directory:_

```
$:  dcl start
```

Any dependencies are installed and then the CLI will open the scene in a new browser tab automatically.

**Usage**

Notice that boxes that intersect with the laser change their material and become emissive while being hit. Also, if you point your cursor at a box it will change its color to green.

Learn more about how to build your own scenes in our [documentation](https://docs.decentraland.org/) site.


## Copyright info

This scene is protected with a standard Apache 2 licence. See the terms and conditions in the [LICENSE](/LICENSE) file.