import Header from "./components/Header.js";
import RegionList from "./components/RegionList.js";
import CityList from "./components/CityList.js";
import CityDetail from "./components/CityDetail.js";
import { request, requestCityDetail } from "./components/api.js";

export default function App($app) {
    //새로고침하면 정렬 값과 검색어가 적용되지 않음. 새로고침 했을 때 state 값을 알맞게 설정해줘야 함
    //새로고침 시 웹사이트의 주소를 확인해서 state 값을 알맞게 업데이트 해준다.
    const getSortBy = () => {
        if (window.location.search) {
            return window.location.search.split('sort=')[1].split('&')[0];
        } else {
            return 'total';
        }
    }

    const getSearchWord = () => {
        if (window.location.search && window.location.search.includes("search=")) {
            return window.location.search.split('search=')[1];
        }
        return '';
    }

    this.state = {
        startIdx: 0,
        sortBy: getSortBy(),
        searchWord: getSearchWord(),
        region: window.location.pathname.replace('/', ''),
        cities: '',
        currentPage: window.location.pathname, //메인페이지, 상세페이지 구분
    };
    

    //함수 호출시 새로운 헤더 인스턴스 생성(다시 렌더링)
    const renderHeader = () => {
        new Header({
            $app,
            initialState: { sortBy: this.state.sortBy, searchWord: this.state.searchWord, currentPage: this.state.currentPage },
            handleSortChange: async (sortBy) => {
                const pageUrl = `/${this.state.region}?sort=${sortBy}`;
                //웹페이지 url 변경
                history.pushState(
                    null,
                    null,
                    this.state.searchWord ? pageUrl + `&search=${this.state.searchWord}` : pageUrl
                )
                //정렬 기준이 적용된 새로운 데이터 가져오기
                const cities = await request(0, this.state.region, sortBy, this.state.searchWord);
                
                //상태 변경
                this.setState({
                    ...this.state,
                    startIdx: 0,
                    sortBy: sortBy,
                    cities: cities
                })
            },
            handleSearch: async (searchWord) => {
                //새로운 url로 이동
                history.pushState(
                    null,
                    null,
                    `${this.state.region}?sort=${this.state.sortBy}&search=${searchWord}`
                );

                //검색 결과 가져오기
                const cities = await request(0, this.state.region, this.state.sortBy, searchWord);

                //상태 변경
                this.setState({
                    ...this.state,
                    startIdx: 0,
                    searchWord: searchWord,
                    cities: cities,
                })
            }
        });
    }

    const renderRegionList = () => {
        new RegionList({
            $app,
            initialState: this.state.region,
            handleRegion: async (region) => {
                console.log("handleRegion");
                console.log(region);
                history.pushState(null, null, `/${region}?sort=total`);
                const cities = await request(0, region, 'total');
                console.log(cities);
                this.setState({
                    ...this.state,
                    startIdx: 0,
                    region: region,
                    searchWord: '',
                    cities: cities
                });
            }
        });
    }

    const renderCityList = () => {
        new CityList({ 
            $app, 
            initialState: this.state.cities,
            handleLoadMore: async () => {
                //더보기 버튼 클릭했을 때
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
            },
            handleItemClick: (id) => {
                history.pushState(null, null, `/city/${id}`);
                this.setState({
                    ...this.state,
                    currentPage: `/city/${id}`,
                })
            }
        });
    }
    
    const renderCityDetail = async (cityId) => {
        try {
            const cityDetailData = await requestCityDetail(cityId);
            new CityDetail({ $app, initialState: cityDetailData });
        } catch(err) {
            console.log(err);
        }
    }

    //외부에서 직접 호출 가능
    this.setState = (newState) => {
        this.state = newState; 
        render();
    }

    const render = () => {
        const path = this.state.currentPage;
        $app.innerHTML = '';

        //상세페이지 렌더링
        if (path.startsWith('/city/')) {
            const cityId = path.split('/city/')[1];
            renderHeader();
            renderCityDetail(cityId);
        } else {
            //메인페이지 렌더링
            renderHeader();
            renderRegionList();
            renderCityList();
        }
    }

    //뒤로가기, 앞으로가기
    window.addEventListener('popstate', async () => {
        const urlPath = window.location.pathname;

        const prevRegion = urlPath.replace('/', '');
        const prevSortBy = getSortBy();
        const prevSearchWord = getSearchWord();
        const prevStartIdx = 0;
        const prevCities = await request(prevStartIdx, prevRegion, prevSortBy, prevSearchWord);
        
        this.setState({
            ...this.state,
            startIdx: prevStartIdx,
            sortBy: prevSortBy,
            region: prevRegion,
            searchWord: prevSearchWord,
            cities: prevCities,
            currentPage: urlPath,
        });
    });

    //함수 내부 전용 초기화 함수, 외부에서 호출 불가능
    const init = async () => {
        const path = this.state.currentPage;

        if (path.startsWith('/city/')) {
            render();
        } else {
            const cities = await request(
                this.state.startIdx, 
                this.state.region, 
                this.state.sortBy, 
                this.state.searchWord
            );
            console.log("init 에서 region");
            console.log(this.state.region);
            
            this.setState({
                ...this.state,
                cities: cities, // 2. cities: {cities:[{}, {}, ...], isEnd:false}
            });
        }
        
    }
    
    init();
}   