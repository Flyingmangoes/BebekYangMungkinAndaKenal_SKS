interface IPEntry {

}

interface LoginAttempts {
    Attempts: number;
    LockedAt: Date;
}

class LoginPrison {
    private records: Map<string, LoginAttempts>;
    lookout_duration: Date;
    max_attempt: number;
    constructor(max: number, lockout: Date) {
        this.records = new Map<string, LoginAttempts>;
        this.max_attempt = max
        this.lookout_duration = lockout
    }

    public RecordFailure(): void {

    }

    public IsLocked(): [boolean, Date] {
    
    }

    public Release(): void {

    }

    private Cleanup(): void {

    }
}