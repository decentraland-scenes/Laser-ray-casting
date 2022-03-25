//-------------------------------------------------------
// Configuration constants
const boxesCount = 10
const speed = 1
const rayDistance = 20

//-------------------------------------------------------
// Materials
const defaultMaterial = new Material()
defaultMaterial.metallic = 0
defaultMaterial.roughness = 1
defaultMaterial.albedoColor = new Color3(0.2, 0.2, 1)

const hitMaterial = new Material()
hitMaterial.metallic = 1
hitMaterial.roughness = 0.5
hitMaterial.albedoColor = new Color3(1, 1, 30)

const hitMaterial2 = new Material()
hitMaterial2.metallic = 1
hitMaterial2.roughness = 0.5
hitMaterial2.albedoColor = new Color3(0.2, 1, 0.2)

const rayMaterial = new Material()
rayMaterial.metallic = 1
rayMaterial.roughness = 0.5
rayMaterial.albedoColor = new Color3(30, 1, 1)

//-------------------------------------------------------
// Parent cube
const rayCube = new Entity()
const rayTransform = new Transform()
rayCube.addComponentOrReplace(rayTransform)

rayTransform.position.x = 16
rayTransform.position.y = 1.645

//-------------------------------------------------------
// Child cube with renderer
const rayCubeObject = new Entity()
const rayBoxShape = new BoxShape()
const rayObjectTransform = new Transform()

rayBoxShape.withCollisions = false
rayCubeObject.addComponent(rayBoxShape)
rayCubeObject.addComponentOrReplace(rayMaterial)
rayCubeObject.addComponentOrReplace(rayObjectTransform)

rayCubeObject.setParent(rayCube)

// This is just to show a ray-like object to represent
// the casted ray
rayObjectTransform.scale.x = 0.1
rayObjectTransform.scale.y = 0.1
rayObjectTransform.scale.z = rayDistance
rayObjectTransform.position.z = rayDistance / 2 + 3

engine.addEntity(rayCube)

//-------------------------------------------------------
// Create all the boxes with default values

@Component('Movement')
export class MovingCube {}

const cubes = engine.getComponentGroup(MovingCube)

for (let i = 0; i < boxesCount; i++) {
  const boxShape = new BoxShape()
  const cube = new Entity()
  const transform = new Transform()

  cube.addComponent(defaultMaterial)
  cube.addComponentOrReplace(transform)
  transform.position.set(2 + i * 3, 1.5, 16)
  cube.addComponentOrReplace(boxShape)
  cube.addComponent(new MovingCube())
  engine.addEntity(cube)
}

//-------------------------------------------------------
// System that casts the rays
const rayId1 = 1
const rayId2 = 2

class RaycastingSystem implements ISystem {
  group = engine.getComponentGroup(Transform)

  update(dt: number) {
    // Fixed ray
    const ray: Ray = {
      origin: turret.getComponent(Transform).position,
      direction: Vector3.Forward(),
      distance: 1000
    }

    // For the fixed ray, we cast a hit first
    PhysicsCast.instance.hitAll(
      ray,
      (e) => {
        if (e.didHit) {
          for (const entityHit of e.entities) {
            engine.entities[entityHit.entity.entityId].addComponentOrReplace(
              hitMaterial
            )
          }
        } else {
          for (const entity of this.group.entities) {
            if (entity !== rayCube && entity !== rayCubeObject) {
              entity.addComponentOrReplace(defaultMaterial)
            }
          }
        }
      },
      rayId1
    )

    // Ray from camera
    const rayFromCamera: Ray = PhysicsCast.instance.getRayFromCamera(1000)

    // For the camera ray, we cast a hit all
    PhysicsCast.instance.hitAll(
      rayFromCamera,
      (e) => {
        if (e.didHit) {
          for (const entityHit of e.entities) {
            engine.entities[entityHit.entity.entityId].addComponentOrReplace(
              hitMaterial2
            )
          }
        }
      },
      rayId2
    )
  }
}

//-------------------------------------------------------
// This system moves all the cubes to the right and when
// a limit is reached, teleports the cube to the left
class MovingCubes implements ISystem {
  update(dt: number) {
    const delta = speed * dt
    for (const entity of cubes.entities) {
      if (entity !== rayCube && entity !== rayCubeObject) {
        const transform = entity.getComponent(Transform)

        transform.position.x += delta

        if (transform.position.x >= 31) transform.position.x -= 30
      }
    }
  }
}

//-------------------------------------------------------
// Adds systems to the engine
engine.addSystem(new RaycastingSystem())
engine.addSystem(new MovingCubes())

// laser turret
const turretBase = new Entity()
turretBase.addComponent(new GLTFShape('models/TurretBase_01.glb'))
turretBase.addComponent(
  new Transform({
    position: new Vector3(16, 0, 2)
  })
)
engine.addEntity(turretBase)

const turret = new Entity()
turret.addComponent(new GLTFShape('models/Turret_01.glb'))
turret.addComponent(
  new Transform({
    position: new Vector3(16, 1, 2)
  })
)
engine.addEntity(turret)

// ground
const floor = new Entity()
floor.addComponent(new GLTFShape('models/Floor_sciFi_03.glb'))
floor.addComponent(
  new Transform({
    position: new Vector3(16, 0, 16),
    scale: new Vector3(2, 0, 2)
  })
)
engine.addEntity(floor)
