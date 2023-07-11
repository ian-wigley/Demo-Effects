require(["out/Balls.js"], function (BallDemo: any) {
    let balls = new BallDemo();
    balls.Initialize();
    balls.load("cs.dat", "cosine");
    balls.load("sn.dat", "sine");
    balls.Run();
});

require.config({
    baseUrl: "out",
    paths: {
        "some": "Balls"
    },
    waitSeconds: 15,
});
