class Camera{ 
    constructor(){
    this.eye = new Vector3([0,0,3]);
    this.at = new Vector3([0,0,-100]);
    this.up = new Vector3([0,1,0]);
    this.speed = 0.1;
    }
    reset() {
        this.eye = new Vector3([0, 0, 3]);  
        this.at = new Vector3([0, 0, -100]);  
        this.up = new Vector3([0, 1, 0]); 
        g_globalAngle = 0;
    }


    forward(){
        var f =this.at.sub(this.eye);
        f = f.div(f.magnitude());
        this.at= this.at.add(f);
        this.eye = this.eye.add(f);
    }

    back(){
        var f =this.eye.sub(this.at);
        f = f.div(f.magnitude());
        this.at= this.at.add(f);
        this.eye = this.eye.add(f);
    }

    left() {
        var f = this.eye.sub(this.at);
        f = f.div(f.magnitude());
        if (!(f instanceof Vector3) || !(this.up instanceof Vector3)) {
            console.error('Invalid Vector3 objects in Camera.left');
            return;
        }
        var s = Vector3.cross(f, this.up);
        s = s.div(s.magnitude());
        this.at = this.at.add(s);
        this.eye = this.eye.add(s);
    }
    
    right() {
        var f = this.eye.sub(this.at);
        f = f.div(f.magnitude());
        if (!(f instanceof Vector3) || !(this.up instanceof Vector3)) {
            console.error('Invalid Vector3 objects in Camera.right');
            return;
        }
        var s = Vector3.cross(f, this.up);
        s = s.div(s.magnitude());
        this.at = this.at.sub(s);
        this.eye = this.eye.sub(s);
    }
    moveup(){
        var s = this.up.div(this.up.magnitude());
        this.at = this.at.add(s);
        this.eye = this.eye.add(s);
    }

    
    movedown(){
        var s = this.up.div(this.up.magnitude());
        this.at = this.at.sub(s);
        this.eye = this.eye.sub(s);
    }
    

}