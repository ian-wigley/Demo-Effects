require(["out/Balls.js"], function (BallDemo: any) {
    let balls = new BallDemo();
    balls.Initialize();
    balls.Run();
});

require.config({
    baseUrl: "out",
    paths: {
        "some": "Balls"
    },
    waitSeconds: 15,
});
