import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import { FeedItem, User, GithubAuth } from '@/api/models';
import Axios from 'axios'
import urls, { join, base } from '@/api/urls';
Vue.use(Vuex);

export interface AppState {
    feed: Array<FeedItem>;
    search: string;

    bookmarks: string[];

    bookmarkMode: boolean;
    user: User | null;

}

const store: StoreOptions<AppState> = {
    state: {
        feed: [],
        search: "",
        bookmarks: [],
        bookmarkMode: false,
        user: null
    },
    mutations: {
        setFeed(state, feed) {
            state.feed = feed;
        },
        setSearch(state, search) {
            state.search = search;
        },
        setBookmarks(state, bookmarks) {
            state.bookmarks = bookmarks;
        },
        setBookmarkMode(state, value){
            state.bookmarkMode = value;
        },
        setUser(state, user) {
            state.user = user;
        },
    },
    actions: {
        saveBookmarks({ state }) {
            localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
        },
        loadBookmarks({ state, commit }) {
            if (localStorage.getItem("bookmarks")) {
                const bookmarks = JSON.parse(localStorage.getItem("bookmarks")!);
                commit("setBookmarks", bookmarks);
            }
        },
        auth({ state }, model: GithubAuth) {
            return Axios.post(join(base, urls.auth.base), model).then(response => response.data).catch((e) => { throw e.response.data; });
        },
        loadUser({ state, commit }) {
            return Axios.get(join(base, urls.user.base)).then(response => response.data).then(user => {
                return commit("setUser", user);
            }).catch((e) => { throw e.response.data; });
        },
        logout({ state, commit }) {
            return Axios.post(join(base, urls.user.base, urls.user.logout)).then(response => response.data).then(() => {
                return commit("setUser", null);
            }).catch((e) => { throw e.response.data; });
        },
        uploadImage({state, commit}, file: File){
            const formData = new FormData();
            formData.append("image", file);
            return Axios.post(join(base, urls.posts.base, urls.posts.upload), formData).then(response => response.data).catch((e) => {throw e.response.data;});
        }
    },
};

export default new Vuex.Store(store);
