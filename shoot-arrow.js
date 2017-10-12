// http://www.iforce2d.net/b2dtut/sticky-projectiles
// http://www.emanueleferonato.com/2012/12/14/box2d-flying-arrow-engine-first-attempt/

cc.Class({
    extends: cc.Component,

    properties: {
        arrow: {
            type: cc.Node,
            default: null
        }
    },
    onEnable: function () {
        this.debugDrawFlags = cc.director.getPhysicsManager().debugDrawFlags;
        cc.director.getPhysicsManager().debugDrawFlags = 
            cc.PhysicsManager.DrawBits.e_jointBit |
            cc.PhysicsManager.DrawBits.e_shapeBit
            ;
    },
//  git 測試
    onDisable: function () {
        cc.director.getPhysicsManager().debugDrawFlags = this.debugDrawFlags;
    },

    // use this for initialization
    onLoad: function () {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchBegan, this);
        this.arrowBodies = [];
    },
    // 位置是个别扭的存在
    onTouchBegan: function (event) {
        // 获得触点节点的位置坐标
        let touchLoc = event.touch.getLocation();
        // 复制了一个节点
        let node = cc.instantiate(this.arrow);
        node.active = true;
        // 触点位置减节点位置,获得一个差向量
        let vec = cc.v2(touchLoc).sub(node.position); vec.sub();
        // 弓箭节点rotation(角度) , 使用反正切  degree =  radius * 180/PI 
        node.rotation = -Math.atan2(vec.y, vec.x)   *    180 / Math.PI;
        // 获取场景
        cc.director.getScene().addChild(node);
        // 向量长度(用于)
        let distance =  vec.mag();
        // 由向量给予速度 (先归一在乘以速度)
        let velocity =  vec.normalize().mulSelf(800);

        let arrowBody = node.getComponent(cc.RigidBody);
        arrowBody.linearVelocity = velocity;

        this.arrowBodies.push(arrowBody);
    },

    // 
    update: function (dt) {
        let dragConstant = 0.1;
        let arrowBodies = this.arrowBodies;
        for (let i = 0; i < arrowBodies.length; i++) {
            let arrowBody = arrowBodies[i];
            // 箭的移动速度
            let velocity = arrowBody.linearVelocity;
            //  刚体的速度是个向量,通过mag得到了这个向量的距离,这个距离就是速度,物体在
            let speed = velocity.mag();
            // 如果速度等于 0
            if (speed === 0) continue;
            // 获得方向  用速度的normalize 来获得,可以借鉴
            let direction = velocity.normalize();
            // 将一个坐标转换成刚体相对坐标,            水平向前的一个方向
            let pointingDirection = arrowBody.getWorldVector( cc.v2( 1, 0 ) );
            // 给一个相对物体水平的冲量:重点是相对物体的,实际的方向不一定是水平
            let flightDirection = arrowBody.linearVelocity;
            // 获取速度线速度
            let flightSpeed = flightDirection.mag();
            //  将飞行向量转换成世界方向
            flightDirection.normalizeSelf();
            
            let dot = cc.pDot( flightDirection, pointingDirection );
            // 获得力  
            let dragForceMagnitude = (1 - Math.abs(dot)) * flightSpeed * flightSpeed * dragConstant * arrowBody.getMass();
            
            let arrowTailPosition = arrowBody.getWorldPoint( cc.v2( -80, 0 ) );
            // 施加一个力到刚体上指定的点上，这个点是世界坐标系下的一个点 
            // 妈的很坑这个点是世界坐标系的点 ,这个力也是要一个大方向的力
            arrowBody.applyForce( flightDirection.mul(-dragForceMagnitude), arrowTailPosition );
        }
    },
});
