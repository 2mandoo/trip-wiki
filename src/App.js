import Header from "./components/Header.js";
import RegionList from "./components/RegionList.js";
import CityList from "./components/CityList.js";
import CityDetail from "./components/CityDetail.js";
import { request } from "./components/api.js";

export default function App($app) {
    this.state = {
        startIdx: 0,
        sortBy: '',
        searchWord: '',
        region: '',
        cities: ''
    };

    const header = new Header();
    const regionegionList = new RegionList();
    const cityList = new CityList({ 
        $app, 
        initialState: this.state.cities,
        handleLoadMore: async () => {
            const newStartIdx = this.state.startIdx + 40;
            const newCities = await request(newStartIdx, this.state.region, this.state.sortBy, this.state.searchWord);
            // newCities = {cities:[{}, {}, ...], isEnd:false}
            console.log(this.state.cities); //{cities:[{}, {}, ...], isEnd:false}
            this.setState({
                ...this.state,
                startIdx: newStartIdx,
                cities: {
                    cities: [...this.state.cities.cities, ...newCities.cities],
                    isEnd: newCities.isEnd,
                }
            })
        }
    });
    
    const cityDetail = new CityDetail();

    //외부에서 직접 호출 가능
    this.setState = (newState) => {
        this.state = newState; 
        cityList.setState(this.state.cities);
    }

    //함수 내부 전용 초기화 함수, 외부에서 호출 불가능
    const init = async () => {
        const cities = await request(this.state.startIdx, this.state.region, this.state.sortBy, this.state.searchWord);
        console.log(cities);
        
        this.setState({
            ...this.state,
            cities: cities, // 2. cities: {cities:[{}, {}, ...], isEnd:false}
        });
    }
    
    init();
}