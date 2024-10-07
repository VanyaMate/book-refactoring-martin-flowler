module.exports = {
    plays: {
        hamlet: {"name": "Hamlet", "type": "tragedy"},
        'as-like': {"name": "As You Like It", "type": "comedy"},
        othello: {"name": "Othello", "type": "tragedy"}
    },
    invoices: [
        {
            customer: "BigCo",
            performances: [
                {
                    playlD: "hamlet",
                    audience: 55
                },
                {
                    playlD: "as-like",
                    audience: 35
                },
                {
                    playlD: "othello",
                    audience: 40
                }
            ]
        }
    ]
}