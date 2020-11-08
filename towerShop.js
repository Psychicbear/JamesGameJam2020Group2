class Shop {
    constructor(){
        this.shopContainer = {x: W*.9, y:H/4, w: W*.1, h: H*.5}
        this.button = createSprite(this.shopContainer.x - 13,this.shopContainer.y + 25, 25,50)
        this.button.buffer = 100
        this.button.timer = 0
        this.button.setCollider("rectangle")
        this.button.debug = true
        this.isOpen = true
    }

    drawShop(){
        if(this.isOpen){
            rect(this.shopContainer.x,this.shopContainer.y,this.shopContainer.w,this.shopContainer.h)
        }
    }

    drawTowerContainer(){

    }

    shopButton(){
        if(this.button.timer >= this.button.buffer){
            if(this.isOpen){
                this.button.position.x = this.shopContainer.x - 13
                if(this.button.mouseIsPressed){
                    this.isOpen = false;
                    this.button.position.x = W - 13 
                    this.button.timer = 0
                }
            } else{
                this.button.position.x = W - 13
                if(this.button.mouseIsPressed){
                    this.isOpen = true;
                    this.button.position.x = this.shopContainer.x - 13
                    this.button.timer = 0
                }
            }
        } else {this.button.timer += deltaTime}
        this.button.mouseUpdate()
    }
}