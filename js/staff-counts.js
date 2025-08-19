// Load and display staff counts
document.addEventListener('DOMContentLoaded', async function() {
    try {
        const response = await fetch('data/staff-counts.json');
        const data = await response.json();
        
        // Update staff counts in info page
        const foundersElement = document.querySelector('[data-staff="founders"]');
        const coFoundersElement = document.querySelector('[data-staff="coFounders"]');
        const assistantFoundershipElement = document.querySelector('[data-staff="assistantFoundership"]');
        const communityLeadershipElement = document.querySelector('[data-staff="communityLeadership"]');
        const oversightEnforcementElement = document.querySelector('[data-staff="oversightEnforcement"]');
        const managementElement = document.querySelector('[data-staff="management"]');
        const administratorsElement = document.querySelector('[data-staff="administrators"]');
        const moderatorsElement = document.querySelector('[data-staff="moderators"]');
        
        if (foundersElement) foundersElement.textContent = data.founders;
        if (coFoundersElement) coFoundersElement.textContent = data.coFounders;
        if (assistantFoundershipElement) assistantFoundershipElement.textContent = data.assistantFoundership;
        if (communityLeadershipElement) communityLeadershipElement.textContent = data.communityLeadership;
        if (oversightEnforcementElement) oversightEnforcementElement.textContent = data.oversightEnforcement;
        if (managementElement) managementElement.textContent = data.management;
        if (administratorsElement) administratorsElement.textContent = data.administrators;
        if (moderatorsElement) moderatorsElement.textContent = data.moderators;
        
    } catch (error) {
        console.error('Failed to load staff counts:', error);
    }
});