export default function CityList({ $app, initialState, handleLoadMore, handleItemClick }) {
    this.state = initialState;
    
    this.handleLoadMore = handleLoadMore;
    this.handleItemClick = handleItemClick;

    this.$target = document.createElement('div');
    this.$target.className = 'city-list';

    $app.appendChild(this.$target);
    
    this.template = () => {
        let temp = `<div class="city-items-container">`;
        
        if (this.state) {
            this.state.cities.forEach((city) => {
                temp += `
                <div class="city-item" id=${city.id}>
                    <img src=${city.image}></img>
                    <div class="city-item-info">${city.city}, ${city.country}</div>
                    <div class="city-item-score">⭐️ ${city.total}</div>
                </div>`;
            });
        }
        temp += `</div>`;
        return temp;
    };

    this.render = () => {
        this.$target.innerHTML = this.template();

        this.$target.querySelectorAll('div.city-item').forEach((e) => {
            e.addEventListener('click', () => {
                this.handleItemClick(e.id);
            })
        })

        //데이터가 더 있을 때만 버튼 보이도록
        if (!this.state.isEnd) {
            const $loadMoreButton = document.createElement('button');
            $loadMoreButton.className = 'add-items-btn';
            $loadMoreButton.textContent = '+ 더보기';
            this.$target.appendChild($loadMoreButton);

            $loadMoreButton.addEventListener('click', () => {
                this.handleLoadMore();
            })
        }
    };

    //현재 상태를 새로운 상태로 업데이트
    // this.setState = (newState) => {
    //     this.state = newState;
    //     this.render();
    // }

    //render 호출
    this.render();
}

