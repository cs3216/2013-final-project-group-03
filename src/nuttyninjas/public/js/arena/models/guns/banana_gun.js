var BananaGun = function(ninja, view) {
  ShurikenGun.call(this, ninja, view);
  this.delay = 150;
  this.shuriken = Banana;
  this.turn = 1;
}

BananaGun.prototype = new ShurikenGun();
BananaGun.prototype.constructor = BananaGun;

BananaGun.prototype.makeShuriken = function(angle) {
  if (!this.checkDelay()) return false;

	var sign = Math.random() > 0.5 ? 1.0 : -1.0;
	angle = angle + sign * Math.random() * this.angleRange;
  
  var cX = this.shuriken.offsetX() * Math.cos(-angle) + this.ninja.size * Math.sin(-angle);
  var cY = this.shuriken.offsetX() * -Math.sin(-angle) + this.ninja.size * Math.cos(-angle);
  var centerVector = new Vector2D(this.ninja.view.x + cX, this.ninja.view.y + cY);

  var s = this.shuriken.make(this.ninja, centerVector, angle, this.turn);
  this.turn = -1 * this.turn;
  game.addShuriken(s);
  s.shoot();
}