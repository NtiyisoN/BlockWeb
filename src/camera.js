import * as matrix from "./matrix.js";
import * as vector3 from "./vector3.js";
import {radians} from "./math.js";

export class Camera
{
	constructor(display)
	{
		this.display = display;
		this.pos = vector3.create();
		this.hangle = 0;
		this.vangle = 0;
		this.proj = matrix.identity();
		this.view = matrix.identity();
		this.rota = matrix.identity();
		this.forward = vector3.create();
		this.dirvec = vector3.create();
	}
	
	getProjection()
	{
		matrix.perspective(radians(90), this.display.aspect, 0.1, 100, this.proj);
		
		return this.proj;
	}
	
	getView()
	{
		matrix.identity(this.rota);
		matrix.rotateX(this.rota, this.vangle, this.rota);
		matrix.rotateY(this.rota, this.hangle, this.rota);
		matrix.translate(this.rota, -this.pos[0], -this.pos[1], -this.pos[2], this.view);
		
		return this.view;
	}
	
	getForward(speed)
	{
		matrix.identity(this.rota);
		matrix.rotateY(this.rota, -this.hangle, this.rota);
		vector3.create(0, 0, speed, this.forward);
		vector3.transform(this.forward, this.rota, this.forward);
		
		return this.forward;
	}
	
	getLeftward(speed)
	{
		this.getForward(speed);
		this.forward.set([-this.forward[2], this.forward[1], this.forward[0]]);
		
		return this.forward;
	}
	
	getDirVec()
	{
		vector3.create(0, 0, 1, this.dirvec);
		vector3.rotateX(this.dirvec, -this.vangle, this.dirvec);
		vector3.rotateY(this.dirvec, -this.hangle, this.dirvec);
		
		return this.dirvec;
	}
	
	setPos(pos)
	{
		vector3.copy(pos, this.pos);
	}
	
	moveForward(speed)
	{
		vector3.add(this.pos, this.getForward(speed), this.pos);
	}
	
	moveBackward(speed)
	{
		vector3.add(this.pos, this.getForward(-speed), this.pos);
	}
	
	moveLeft(speed)
	{
		vector3.add(this.pos, this.getLeftward(speed), this.pos);
	}
	
	moveRight(speed)
	{
		vector3.add(this.pos, this.getLeftward(-speed), this.pos);
	}
	
	moveUp(speed)
	{
		camera.pos[1] += speed;
	}
	
	moveDown(speed)
	{
		camera.pos[1] -= speed;
	}
	
	turnHori(angle)
	{
		this.hangle += angle;
	}
	
	turnVert(angle)
	{
		this.vangle += angle;
		
		if(this.vangle < radians(-90)) {
			this.vangle = radians(-90);
		}
		else if(this.vangle > radians(90)) {
			this.vangle = radians(90);
		}
	}
}
