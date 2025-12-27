// AXIS Access Control — Pre-Launch + Admin

const AccessControl = (() => {
  const params = new URLSearchParams(window.location.search);
  const isAdmin = params.get("admin") === "true";

  let tutorialComplete = false;

  function hasFullAccess() {
    return isAdmin || tutorialComplete;
  }

  function completeTutorial() {
    tutorialComplete = true;
  }

  function isAdminUser() {
    return isAdmin;
  }

  return {
    hasFullAccess,
    completeTutorial,
    isAdminUser
  };
})();
