'use strict';

app.directive('ebbTextEditor', () => {

    return {
        restrict: 'E',
        templateUrl: 'js/ebb/ebb-text-editor.html',
        scope: {
            user: '=',
            partnerUser: '=',
            workspace: '='
        },
        controller: 'EbbTextEditorCtrl'
    };

});
