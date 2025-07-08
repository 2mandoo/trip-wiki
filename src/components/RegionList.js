export default function RegionList({ $app, initialState, handleRegion }) {
    this.state = initialState;

    this.handleRegion = handleRegion;

    this.$target = document.createElement('div');
    this.$target.className = 'region-list';
    
    $app.appendChild(this.$target);

    this.template = () => {
        const regionList = [
            '🚀 All',
            '🌏 Asia',
            '🕌 Middle-East',
            '🇪🇺 Europe',
            '💃 Latin-America',
            '🐘 Africa',
            '🏈 North-America',
            '🏄 Oceania',
        ];

        let temp = ``;

        regionList.forEach((region) => {
            let regionId = region.split(' ')[1];
            temp += `<div id=${regionId}>${region}</div>`;
        })

        return temp;
    };

     this.render = () => {
        this.$target.innerHTML = this.template();

        if (this.state) {
            console.log("regionList render");
            console.log(this.state);
            let $currentRegion = document.getElementById(this.state);
            $currentRegion && ($currentRegion.className = 'clicked');
        } else {
            document.getElementById('All').className = 'clicked';
        }

        const $regionList = this.$target.querySelectorAll('div');
        $regionList.forEach((e) => {
            e.addEventListener('click', () => {
                console.log('click');
                console.log(e.id);

                this.handleRegion(e.id);
            });
        });
    };

    //현재 상태를 새로운 상태로 업데이트
    this.setState = (newState) => {
        this.state = newState;
        this.render();
    }

    //render 호출
    this.render();
}

