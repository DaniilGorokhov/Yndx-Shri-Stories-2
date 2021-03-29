class Storage {
  constructor() {
    this.initStorage();
  }

  initStorage() {
    // Storage for users -> Map<user.id, user>.
    this.users = new Map();

    // Storage for likes -> Map<user.id, { timestamp, quantity }[]>.
    this.likes = new Map();

    this.sprints = [];
    // Copy of sprint, that property active is true. Added for convenient.
    this.activeSprint = {};

    this.commits = [];
    // Wire commit and summaries - Map<commit.id, summary.id[]>.
    this.commitSummaries = new Map();

    // Wire summaryId and summary entity -> Map<summary.id, summary>.
    this.summaries = new Map();
  }
}

module.exports = {
  Storage,
};
