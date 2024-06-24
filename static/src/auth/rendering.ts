import { getSupabase } from "../supabase/session";
import { GitHubUser } from "../types/github";

export async function renderGitHubLoginButton() {
    const existingButton = document.getElementById("login-with-github");
    if (existingButton) {
        return existingButton;
    }
    const btn = document.createElement("button");
    btn.textContent = "Login with GitHub";
    btn.id = "login-with-github";
    btn.onclick = async () => {
        const supabase = getSupabase();
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "github",
        });
        if (error) {
            console.error("GitHub login error", error);
        }
    };

    document.body.appendChild(btn);
    return btn;
}

export function renderUserInfo(
    user: GitHubUser
) {
    const newInfo = document.createElement("div");
    newInfo.innerHTML = `
    <div id="user-info-container">
    <img id="gh-pp" src="${user.avatar_url}" alt="User avatar" />
    <h2>Hello, ${user.login}</h2>
    </div>
    `;

    const container = document.getElementById("user-info-container");
    if (container) {
        container.style.display = "flex";
        container.style.flexDirection = "column";
        container.style.alignItems = "center";
    }

    const logoutButton = document.createElement("button");

    logoutButton.onclick = () => {
        const supabase = getSupabase();
        supabase.auth.signOut().then(() => {
            window.location.reload();
        })
    };
    logoutButton.textContent = "Logout";
    newInfo.appendChild(logoutButton);
    document.body.appendChild(newInfo);

    return newInfo;
}