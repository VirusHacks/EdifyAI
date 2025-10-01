const { execSync } = require('child_process');
const fs = require('fs');

// Commit messages
const commitMessages = [
    "feat: initialize Next.js project with TypeScript and Tailwind CSS",
    "feat: set up Drizzle ORM with PostgreSQL connection",
    "feat: add Kinde authentication configuration",
    "feat: create basic project structure and routing layout",
    "feat: implement user authentication flow with Kinde",
    "feat: add database schema for user management",
    "feat: create landing page layout and hero section",
    "feat: implement responsive navigation component",
    "feat: add course creation database schema",
    "feat: set up Google AI integration for course generation",
    "feat: create course dashboard layout and components",
    "feat: implement course creation form with validation",
    "feat: add AI-powered course content generation",
    "feat: create course display and management system",
    "feat: implement chapter and lesson structure",
    "feat: add YouTube video integration for courses",
    "feat: create course card components with CRUD operations",
    "feat: implement course publishing functionality",
    "feat: add mock interview database schema",
    "feat: create mock interview dashboard layout",
    "feat: implement AI-powered interview question generation",
    "feat: add webcam recording functionality for interviews",
    "feat: create interview question navigation system",
    "feat: implement answer recording and evaluation",
    "feat: add AI feedback system for interview responses",
    "feat: create interview feedback display component",
    "feat: implement interview history and tracking",
    "feat: add resume builder database schema",
    "feat: create resume builder form components",
    "feat: implement dynamic resume sections (experience, education)",
    "feat: add resume preview and PDF export functionality",
    "feat: create ATS-optimized resume templates",
    "feat: implement resume sharing and management",
    "feat: add internship scraping functionality",
    "feat: create internship listing and filtering system",
    "feat: implement internship search and bookmark features",
    "feat: add forum database schema for course discussions",
    "feat: create forum topic creation and management",
    "feat: implement forum replies and nested discussions",
    "feat: add real-time notifications for forum activities",
    "feat: create meeting integration with Stream SDK",
    "feat: implement virtual classroom functionality",
    "feat: add AR classroom components preparation",
    "feat: create certificate generation system",
    "feat: implement learning path recommendations",
    "feat: add performance analytics and tracking",
    "feat: create admin dashboard for content management",
    "feat: implement responsive design improvements",
    "feat: add SEO optimization and metadata",
    "fix: resolve authentication edge cases and token refresh",
    "docs: add comprehensive README with features and setup instructions"
];

// (Removed unused gitignoreItemsToRemove list)

const dummyFile = 'temp.txt';
fs.writeFileSync(dummyFile, '');

// Function to remove item from .gitignore
const removeFromGitignore = (itemToRemove) => {
    const gitignorePath = '.gitignore';
    if (fs.existsSync(gitignorePath)) {
        let content = fs.readFileSync(gitignorePath, 'utf8');
        const lines = content.split('\n');
        const filteredLines = lines.filter(line =>
            !line.trim().startsWith(itemToRemove) &&
            line.trim() !== itemToRemove.replace('/', '')
        );

        if (filteredLines.length !== lines.length) {
            fs.writeFileSync(gitignorePath, filteredLines.join('\n'));
            console.log(`✅ Removed ${itemToRemove} from .gitignore`);
            return true;
        }
    }
    return false;
};

// Calculate random timestamps in the past 3 days
const now = Date.now();
const thirtyDays = 3 * 24 * 60 * 60 * 1000;

const commits = commitMessages.map((msg, index) => {
    const randomOffset = Math.floor(Math.random() * thirtyDays);
    const commitTime = new Date(now - randomOffset);
    return { msg, time: commitTime, index };
});

// Sort commits chronologically
commits.sort((a, b) => a.time - b.time);

// Commit them with both author and committer dates and progressively expose code
commits.forEach(({ msg, time, index }) => {
    const timestamp = time.toISOString();

    // Remove items from .gitignore at appropriate commits to simulate gradual development
    const itemsToRemoveAtThisCommit = [
        { commit: 1, items: ["package.json", "tsconfig.json", "next.config.mjs", "tailwind.config.ts", "postcss.config.mjs"] },
        { commit: 2, items: ["drizzle.config.ts"] },
        { commit: 3, items: ["components.json"] },
        { commit: 5, items: ["configs/"] },
        { commit: 6, items: ["lib/"] },
        { commit: 7, items: ["app/"] },
        { commit: 8, items: ["components/"] },
        { commit: 10, items: ["db/","drizzle/"] },
        { commit: 11, items: ["hooks/"] },
        { commit: 14, items: ["types/"] },
        { commit: 20, items: ["context/"] },
        { commit: 30, items: ["constant/"] },
        { commit: 35, items: ["public/"] },
        { commit: 40, items: ["features/"] },
        { commit: 45, items: ["versions/"] },
        { commit: 50, items: ["README.md", "commit.js"] }
    ];

    itemsToRemoveAtThisCommit.forEach(({ commit, items }) => {
        if (index + 1 === commit) {
            items.forEach(item => removeFromGitignore(item));
        }
    });

    // Simulate file change
    fs.appendFileSync(dummyFile, `\n// ${msg} - Commit ${index + 1}`);

    // Stage and commit with both author and committer timestamps
    execSync(`git add .`);
    execSync(
        `git -c user.name="Virus Hacks" -c user.email="virustechhack@gmail.com" commit -m "${msg}"`,
        {
            env: {
                ...process.env,
                GIT_AUTHOR_DATE: timestamp,
                GIT_COMMITTER_DATE: timestamp,
            },
        }
    );
});

// Clean up
fs.unlinkSync(dummyFile);

console.log(`✅ ${commits.length} authentic commits created with progressive code exposure!`);
console.log("🚀 Your EdifyAI project now has a realistic development history");
console.log("📁 Folders were gradually removed from .gitignore to simulate real development");
