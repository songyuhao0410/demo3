// http://www.iforce2d.net/b2dtut/sticky-projectiles
// http://www.emanueleferonato.com/2012/12/14/box2d-flying-arrow-engine-first-attempt/
// 本函数是为了打开关节
cc.Class({
    extends: cc.Component,

    onLoad: function () {
        // 熔接关节
        this.weldJoint = this.getComponent(cc.WeldJoint);
    },
    // 碰撞回调 三大参数 contact  
    onPostSolve: function (contact, selfCollider, otherCollider) {
        //  contact 物理碰撞信息 ; elfCollider 自己碰撞体 ; otherCollider 其他碰撞体
        //  getImpulse 获得冲量信息
        var impulse = contact.getImpulse();
        // normalImpulses  法线方向的冲量 小于 转换率不展示与连接关节
        // cc.PhysicsManager.PTM_RATIO  物理单位与像素单位互相转换的比率，一般是 32。
        if (Math.abs(impulse.normalImpulses[0]) < cc.PhysicsManager.PTM_RATIO) return;
        // weldJoint 关节
        let joint = this.weldJoint;
        // 如果关节关闭退出
        if (joint.enabled) {
            joint.enabled = false;
            return;
        }
        // 如果其他碰撞时arrow
        if (otherCollider.node.name === 'arrow') {
            return;
        }

        let arrowBody = selfCollider.body;
        let targetBody = otherCollider.body;
        // 关节的深度可能是 0.6 0
        let worldCoordsAnchorPoint = arrowBody.getWorldPoint( cc.v2(0.6, 0) );
        // 关节的几个参数来进行设置 
        // 1关节连接的客体
        joint.connectedBody = targetBody;
        // 关节锚点
        joint.anchor = arrowBody.getLocalPoint( worldCoordsAnchorPoint );
        // 关节客体的马甸
        joint.connectedAnchor = targetBody.getLocalPoint( worldCoordsAnchorPoint );
        // 关节相对角度
        joint.referenceAngle = targetBody.node.rotation - arrowBody.node.rotation;
        // 最终目的打开关节进行连接
        joint.enabled = true;
    }
});
