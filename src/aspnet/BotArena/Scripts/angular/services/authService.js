var app = angular.module('menuApp');

app.factory('authService', ['$http', '$q', function ($http, $q) {

    function hasValidCacheEntry() {
        var userInfoCacheLifeTimeInMilliseconds = 5 * 60 * 1000; // 5 min

        return window.sessionStorage.lastCurrentUserUpdateDate &&
            new Date() - window.sessionStorage.lastCurrentUserUpdateDate < userInfoCacheLifeTimeInMilliseconds;
    }

    function setCurrentUser(user) {
        return window.sessionStorage.currentUser = user;
    }

    function resetCurrentUser() {
        window.sessionStorage.removeItem("currentUser");
    }

    function getCurrentUser() {
        return window.sessionStorage.currentUser;
    }

    function isLoggedIn() {
        return !!getCurrentUser();
    }

    function initializeCurrentUser(allowCache) {
        if (!allowCache || !hasValidCacheEntry()) {
            $http({
                method: "GET",
                url: gosuArena.url.createAbsolute("/api/AuthSession/Current")
            }).then(function (user) {
                setCurrentUser(user);
            }, function (e) {
                if (e.status === 404) {
                    // Not logged in
                    resetCurrentUser();
                } else {
                    // Unexpected error
                }
            });
        }
    }

    function login(username, password, rememberMe) {

        return $q(function(resolve, reject) {

            $http({
                method: "POST",
                url: gosuArena.url.createAbsolute("/api/AuthSession/"),
                data: {
                    username: username,
                    password: password,
                    rememberMe: rememberMe
                }
            }).then(function (user) {
                setCurrentUser(user);
                resolve(user);
            }, function (e) {
                reject({
                    invalidCredentials: e.status === 401,
                    error: e
                });
            });
        });
    }

    function logOff() {

        return $q(function(resolve, reject) {
            $http({
                method: "DELETE",
                url: gosuArena.url.createAbsolute("/api/AuthSession/Current")
            }).then(function () {
                // Signed out successfully
                resetCurrentUser();
                resolve();
            }, function (e) {
                // Unexpected error
                reject(e);

                // Since we don't know what happened, check the actual status with the server
                initializeCurrentUser(false);
            });
        });
    }

    initializeCurrentUser(true);

    return {
        login: login,
        logOff: logOff,
        isLoggedIn: isLoggedIn,
        getCurrentUser: getCurrentUser
    };
}]);