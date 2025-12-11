require(["out/Balls.js"], function (BallDemo: any) {
    let balls = new BallDemo();
    balls.initialize();
    balls.load("cs.dat", "cosine");
    balls.load("sn.dat", "sine");
    balls.run();
});

require.config({
    baseUrl: "out",
    paths: {
        "some": "Balls"
    },
    waitSeconds: 15,
});
