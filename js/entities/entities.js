/**
 * Player Entity
 */
game.PlayerEntity = me.Entity.extend({

    /**
     * constructor
     */
    init: function (x, y, settings) {
        this._super(me.Entity, "init", [x, y, settings]);
        this.body.setVelocity(2, 2);
        this.body.gravity.set(0, 0);
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
        this.alwaysUpdate = true;
        this.renderable.addAnimation("walkleft", [1, 5, 9, 13]);
        this.renderable.addAnimation("walkright", [3, 7, 11, 15]);
        this.renderable.addAnimation("walkup", [2, 6, 10, 14]);
        this.renderable.addAnimation("walkdown", [0, 4, 8, 12]);
        this.renderable.addAnimation("stand", [0]);
        this.renderable.setCurrentAnimation("stand");

    },
    distanceToPoint(vector) {
        console.log(vector);
    },
    /**
     * update the entity
     */
    update: function (dt) {
        if (me.input.isKeyPressed('left')) {
            // update the entity velocity
            this.body.vel.y = 0;
            this.body.vel.x -= this.body.accel.x * me.timer.tick;
            // change to the walking animation
            if (!this.renderable.isCurrentAnimation("walkleft")) {
                this.renderable.setCurrentAnimation("walkleft");
            }
        }
        else if (me.input.isKeyPressed('right')) {
            // update the entity velocity
            this.body.vel.y = 0;
            this.body.vel.x += this.body.accel.x * me.timer.tick;
            // change to the walking animation
            if (!this.renderable.isCurrentAnimation("walkright")) {
                this.renderable.setCurrentAnimation("walkright");
            }
        }
        else if (me.input.isKeyPressed('up')) {
            // update the entity velocity
            this.body.vel.x = 0;
            this.body.vel.y -= this.body.accel.y * me.timer.tick;
            // change to the walking animation
            if (!this.renderable.isCurrentAnimation("walkup")) {
                this.renderable.setCurrentAnimation("walkup");
            }
        }
        else if (me.input.isKeyPressed('down')) {
            // update the entity velocity
            this.body.vel.x = 0;
            this.body.vel.y += this.body.accel.y * me.timer.tick;
            // change to the walking animation
            if (!this.renderable.isCurrentAnimation("walkdown")) {
                this.renderable.setCurrentAnimation("walkdown");
            }
        }

        else {
            this.body.vel.x = 0;
            this.body.vel.y = 0;
            // change to the standing animation
            this.renderable.setCurrentAnimation("stand");
        }

        if (me.input.isKeyPressed('jump')) {
            // make sure we are not already jumping or falling
            if (!this.body.jumping && !this.body.falling) {
                // set current vel to the maximum defined value
                // gravity will then do the rest
                this.body.vel.y = -this.body.maxVel.y * me.timer.tick;

                // set the jumping flag
                this.body.jumping = true;
            }
        }

        // apply physics to the body (this moves the entity)
        this.body.update(dt);

        // handle collisions against other shapes
        me.collision.check(this);
        return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
    },

    /**
     * colision handler
     * (called when colliding with other objects)
     */

    onCollision: function (response, other) {
        switch (response.b.body.collisionType) {
            case me.collision.types.WORLD_SHAPE:
                if (other.type == 'outline') {
                    return true;
                }
                break;
            case me.collision.types.COLLECTABLE_OBJECT:
                if (other.type == 'coin') {
                    me.audio.play("collect_coin");
                }
                break;
            case me.collision.types.ENEMY_OBJECT:
                if (other.name == 'whitey') {
                    if (me.input.isKeyPressed('action')) {
                        console.log(1);
                    }
                }
                if (other.type == 'doors') {
                    // gdy mamy klucz uznajemy, ze drzwi otwarte - zerujemy kolizje
                    //other.body.setCollisionMask(me.collision.types.NO_OBJECT);
                }
                break;
        }
        return true;
    }
});

/**
 * a Coin entity
 */
game.CoinEntity = me.CollectableEntity.extend({
    // extending the init function is not mandatory
    // unless you need to add some extra initialization
    init: function (x, y, settings) {
        this._super(me.CollectableEntity, "init", [x, y, settings]);
        this.body.gravity.set(0, 0);
        this.renderable.addAnimation("rotate", [0, 1, 2, 3, 4, 5, 6, 7]);
        this.renderable.setCurrentAnimation("rotate");

    },

    // this function is called by the engine, when
    // an object is touched by something (here collected)
    onCollision: function (response, other) {
        // do something when collected
        // make sure it cannot be collected "again"
        this.body.setCollisionMask(me.collision.types.NO_OBJECT);
        game.data.score += 1;
        //game.DoorsEntity.renderable.setCurrentAnimation("open");
        me.game.world.removeChild(this);
        return false;
    }
});

/**
 * a Door entity
 */
game.DoorsEntity = me.Entity.extend({
    init: function (x, y, settings) {
        this._super(me.Entity, "init", [x, y, settings]);
        this.renderable.addAnimation("stay", [1]);
        this.renderable.addAnimation("open", [2]);
        this.renderable.setCurrentAnimation("stay");
    },
});

/**
 * a NPCEntity entity
 */
game.NPCEntity = me.Entity.extend({
    init: function (x, y, settings) {
        this._super(me.Entity, "init", [x, y, settings]);
        this.renderable.addAnimation("stay", [0]);
        this.renderable.setCurrentAnimation("stay");
    },
});