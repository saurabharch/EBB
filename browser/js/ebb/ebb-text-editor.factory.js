app.factory('EbbTextEditorFactory', function(Socket) {

    const EbbTextEditorFactory = {};

    EbbTextEditorFactory.makeChangeToTextEditor = (toUser, fromUser, workspace) => {
        Socket.emit('madeEdit', toUser, fromUser, workspace);
    };

    return EbbTextEditorFactory;

});
