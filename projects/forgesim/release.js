// Published previews are eligible; drafts and incomplete packages are not.
// Keep the HTML links usable when JavaScript or GitHub is unavailable.
(async function updateReleaseDownloads() {
  const block = document.querySelector("#download");
  if (!block) return;

  const installerLink = block.querySelector("[data-release-installer]");
  const zipLink = block.querySelector("[data-release-zip]");
  const notesLink = block.querySelector("[data-release-notes]");
  const versionLabel = block.querySelector(".download-version");
  const previewBadge = block.querySelector(".preview-badge");
  if (!installerLink || !zipLink || !notesLink || !versionLabel) return;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(
      "https://api.github.com/repos/L0932/ForgeSim/releases?per_page=100",
      {
        headers: { Accept: "application/vnd.github+json" },
        signal: controller.signal,
      }
    );
    if (!response.ok) return;

    const releases = await response.json();
    if (!Array.isArray(releases)) return;

    const candidates = releases
      .filter((release) => release && !release.draft && release.published_at)
      .sort((a, b) => Date.parse(b.published_at) - Date.parse(a.published_at));

    for (const release of candidates) {
      if (!/^v\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(release.tag_name)) continue;
      if (!Array.isArray(release.assets)) continue;

      const version = release.tag_name.slice(1);
      const baseName = `ForgeSim-${version}-Windows-AMD64`;
      const downloadRoot =
        `https://github.com/L0932/ForgeSim/releases/download/${release.tag_name}/`;
      const findAsset = (name) => release.assets.find((asset) =>
        asset && asset.name === name && asset.state === "uploaded" &&
        asset.browser_download_url === downloadRoot + name
      );

      const installer = findAsset(`${baseName}-Setup.exe`);
      const zip = findAsset(`${baseName}.zip`);
      // Update the whole release together, only when both packages and
      // their checksums are ready. Never mix versions across the links.
      if (!installer || !zip ||
          !findAsset(`${baseName}-Setup.exe.sha256`) ||
          !findAsset(`${baseName}.zip.sha256`)) continue;

      installerLink.href = installer.browser_download_url;
      zipLink.href = zip.browser_download_url;
      notesLink.href =
        `https://github.com/L0932/ForgeSim/releases/tag/${release.tag_name}`;
      versionLabel.textContent = version;
      if (previewBadge) previewBadge.hidden = !release.prerelease;
      block.setAttribute("aria-label", "Download ForgeSim");
      break;
    }
  } catch {
    // Network errors, rate limits, and timeouts leave the HTML fallback intact.
  } finally {
    clearTimeout(timeout);
  }
})();
