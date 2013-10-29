var Game = function() {
  this.map = null;
  this.ninjas = [];
  this.shurikens = [];
  this.stage = null;
  this.colors = ['yellow', 'red', 'blue', 'orange', 'purple', 'green', 'brown', 'cyan'];

  this.box = new b2World(new b2Vec2(0, 0), true);
  var listener = new b2ContactListener();

  Box2D.customizeVTable(listener, [{
      original: Box2D.b2ContactListener.prototype.PostSolve,
      replacement:
          function (thsPtr, contactPtr) {
              var contact = Box2D.wrapPointer( contactPtr, b2Contact );
              var bodyA = contact.GetFixtureA().GetBody().actor;
              var bodyB = contact.GetFixtureB().GetBody().actor;

              bodyA.collide(bodyB);
              bodyB.collide(bodyA);
          }
  }]);
  this.box.SetContactListener(listener);
}

Game.prototype.addNinja = function(data) {
  if (this.colors.length === 0) return false;

  var player = new Player(data);

  // var position = getFreePosition
  var position = new Vector2D(Math.random() * 500, 100);
  // var position = new Vector2D(300, 200);

  var fixture = new b2FixtureDef;
  fixture.set_density(1);
  fixture.set_restitution(0);
  fixture.set_friction(1.0);
  
  var shape = new b2CircleShape();
  shape.set_m_radius(NINJA_RADIUS / SCALE);
  fixture.set_shape(shape);

  var bodyDef = new b2BodyDef;
  bodyDef.set_type(Box2D.b2_dynamicBody);
  bodyDef.set_position(position.tob2Vec2(SCALE));

  var body = this.box.CreateBody(bodyDef);
  body.CreateFixture(fixture);
  
  var color = this.colors.splice(0, 1)[0];
  var ninja = new Ninja(player, color);
  ninja.size = NINJA_RADIUS;
  player.controlled_object = ninja;

  var view = new createjs.Container();
  view.x = position.x;
  view.y = position.y;

  var body_view = new createjs.Bitmap("/images/ninja-yellow.png");
  body_view.name = "body";
  body_view.scaleX = NINJA_RADIUS  / (500 / 2.0);
  body_view.scaleY = NINJA_RADIUS  / (500 / 2.0);
  body_view.regX = 500 / 2;
  body_view.regY = 500 / 2;
  view.addChild(body_view);

  var hitpoint_view = new createjs.Shape();
  hitpoint_view.name = "hitpoint";
  hitpoint_view.graphics.beginFill(color).drawRect(-(NINJA_RADIUS*1.5), -NINJA_RADIUS-20, NINJA_RADIUS*3, 10);
  view.addChild(hitpoint_view);

  var name_view = new createjs.Text(player.name, "10px Arial", ninja.color);
  name_view.name = "name";
  name_view.textAlign = "center";
  name_view.x = 0;
  name_view.y = - NINJA_RADIUS - 35;
  name_view.lineWidth = 2 * NINJA_RADIUS;
  view.addChild(name_view);

  ninja.body = body;
  ninja.body.actor = ninja;
  ninja.view = view;

  this.ninjas.push(ninja);
  this.stage.addChild(ninja.view);

  return true;
}

Game.prototype.removeNinja = function(s) {
  this.stage.removeChild(s.view);
  this.ninjas = _.without(this.ninjas, s);
  this.box.DestroyBody(s.body);
  this.colors.push(s.color);
}

Game.prototype.addShuriken = function(s) {
  this.shurikens.push(s);
  this.stage.addChild(s.view);
}

Game.prototype.removeShuriken = function(s) {
  this.stage.removeChild(s.view);
  this.shurikens = _.without(this.shurikens, s);
  this.box.DestroyBody(s.body);
}