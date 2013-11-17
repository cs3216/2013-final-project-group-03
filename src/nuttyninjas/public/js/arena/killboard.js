var KBConfig = {
  width: 135,
  height: 40,
  part_width: 40,
  part_height: 40,
  disappearDelay: 100,
  appearDelay: 100,
  moveDelay: 100,
  stayDelay: 2000,

  paddingTop: 50
};

function Kill(data, x, y) {
  var ShurikenImages = {
    'shield' : {img: '/images/katana.png', w: 1969, h: 206},
    'shuriken': {img: '/images/projectiles/shuriken.png', w: 344, h: 344},
    'laser': {img: '/images/projectiles/laser.png', w: 320, h: 417},
    'banana': {img: '/images/projectiles/banana.png', w: 300, h: 218},
    'plasma': {img: '/images/projectiles/plasma.png', w: 240, h: 113},
    'rocket': {img: '/images/projectiles/rocket.png', w: 240, h: 86},
    'hulk_fist': {img: '/images/projectiles/hulk-fist.png', w: 300, h: 142},
    'snowflake': {img: '/images/projectiles/snowflake.png', w: 160, h: 160},
    'Meme': {img: '/images/projectiles/meme-1.png', w: 400, h: 519}
  };

  var getNinjaView = function(color) {
    console.log(color);
    var img = NinjaSchool.images[color] || NinjaSchool.images.yellow;
    if (!img) return false;

    var ninjaview = new createjs.Bitmap(img);
    ninjaview.scaleX = data.killer.size / (500/2.0);
    ninjaview.scaleY = data.killer.size / (500/2.0);
    ninjaview.regX = 500 / 2;
    ninjaview.regY = 500 / 2;
    return  ninjaview;
  };
  
  var getWeaponView = function(type) {
    console.log(type);
    var weapon = ShurikenImages[type];
    var img = weapon.img;
    var weaponview = new createjs.Bitmap(img);
    weaponview.scaleX = KBConfig.part_width / weapon.w;
    weaponview.scaleY = KBConfig.part_height / weapon.h * 0.7;
    weaponview.regX = weapon.w / 2;
    weaponview.regY = weapon.h / 2;
    return weaponview;
  };

  var view = new createjs.Container();
  view.x = x || 0;
  view.y = y || 0;

  var bgview = new createjs.Shape();
  bgview.graphics.beginFill('#ffffff').drawRect(-KBConfig.part_width/2,-KBConfig.part_height/2,KBConfig.width, KBConfig.height);
  bgview.alpha = 0.0;

  var killerview = getNinjaView(data.killer.color);
  killerview.x = 0;
  killerview.y = 0;

  var victimview = getNinjaView(data.victim.color);
  victimview.x = 100;
  victimview.y = 0;

  var weaponview = getWeaponView(data.weapon_type);
  weaponview.x = 50;
  weaponview.y = 0;

  view.addChild(bgview);
  view.addChild(killerview);
  view.addChild(victimview);
  view.addChild(weaponview);

  this.view = view;

  this.width = KBConfig.height;
  this.height = KBConfig.width;
}


var KillBoard = (function() {
  var x = window.innerWidth / 2.0 - KBConfig.width / 2;
  var kill_list = [];

  var push = function (data) {
    // Figure out where to add this
    var last_y = KBConfig.paddingTop;
    if (kill_list.length > 0) {
      pop();
      // last_y += kill_list[kill_list.length-1].view.y + KBConfig.height;
    }

    // Add this last kill onto the list
    var k = new Kill(data, x, last_y);
    k.view.x = x - KBConfig.width;
    k.view.y = last_y;
    k.view.alpha = 0;
    kill_list.push(k);
    createjs.Tween.get(k.view, {override:true}).to({x: x, alpha: 1}, KBConfig.appearDelay);

    game.stage.addChild(k.view);
    setTimeout(pop, KBConfig.stayDelay);
  };

  var pop = function() {
    // Move everyone up
    kill_list.map(function(l) {
      //l.view.y -= KBConfig.height;
      //var target_y = l.view.y - KBConfig.height;
      var target_x = l.view.x + KBConfig.width;
      var tween = createjs.Tween.get(l.view, {override:true})
                    .to({x:target_x, alpha:0}, KBConfig.moveDelay);
    });
    kill_list.shift();
  };

  return {push: push, pop: pop};

})();

PubSub.subscribe('ninja.death', function(msg, data) {
  KillBoard.push(data);
});
