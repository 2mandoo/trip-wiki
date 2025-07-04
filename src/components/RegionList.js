export default function RegionList() {
    this.$target = document.createElement('div');
    this.$target.className = 'region-list';
    
    this.template = () => {

    };

     this.render = () => {

    };

    //현재 상태를 새로운 상태로 업데이트
    this.setState = (newState) => {
        this.state = newState;
        this.render();
    }

    //render 호출
    this.render();
}

