cc.Class({
    extends: cc.Component,

    properties: {
        impulse: cc.v2(0, 1000)
    },
    onBeginContact: function (contact, selfCollider, otherCollider) {
        // 获取世界坐标系下的碰撞信息
        var manifold = contact.getWorldManifold();
        // normal Vec2 世界坐标系下由 A 指向 B 的向量
        if (manifold.normal.y < 1) return;

        let body = otherCollider.body;
        body.linearVelocity = cc.v2();
        body.applyLinearImpulse(this.impulse, body.getWorldCenter());
    },

    // use this for initialization
    onLoad: function () {

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
