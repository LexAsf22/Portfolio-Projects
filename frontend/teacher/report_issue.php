<?php
include("../includes/header.php");
checkRole('teacher');

if (isset($_POST['report'])) {
    $campus      = $_POST['campus'];
    $room        = trim($_POST['room']);
    $category    = $_POST['category'];
    $description = trim($_POST['description']);
    $priority    = $_POST['priority'];
    $user_id     = (int) $_SESSION['user']['id'];

    $allowed_campuses   = ['Campus A', 'Campus B'];
    $allowed_categories = ['Equipment', 'Facility', 'Software'];
    $allowed_priorities = ['Low', 'Medium', 'High'];

    if (!in_array($campus,   $allowed_campuses,   true)) {
        setFlash("Invalid campus selected.",   "error");
    } elseif (!in_array($category, $allowed_categories, true)) {
        setFlash("Invalid category selected.", "error");
    } elseif (!in_array($priority, $allowed_priorities, true)) {
        setFlash("Invalid priority selected.", "error");
    } elseif (empty($room)) {
        setFlash("Room / Lab field is required.", "error");
    } else {
        $stmt = $conn->prepare("
            INSERT INTO issues (user_id, campus, room, category, description, priority, status, created_at)
            VALUES (?, ?, ?, ?, ?, ?, 'Pending', NOW())
        ");
        $stmt->bind_param("isssss", $user_id, $campus, $room, $category, $description, $priority);

        if ($stmt->execute()) {
            setFlash("Issue reported successfully! Admin has been notified.", "success");
        } else {
            setFlash("Something went wrong. Please try again.", "error");
        }
    }

    header("Location: " . $_SERVER['PHP_SELF']);
    exit;
}
?>

<h2>Report a Classroom / Lab Issue</h2>
<?php echo getFlash(); ?>

<div style="max-width:520px; background:#f9f9f9; padding:24px; border-radius:8px; border:1px solid #ddd;">
    <form method="POST" id="issueForm" novalidate>

        <div style="margin-bottom:16px;">
            <label style="display:block; font-weight:bold; margin-bottom:6px;">Campus</label>
            <select name="campus" id="campusSelect"
                    style="width:100%; padding:10px; border-radius:5px; border:1px solid #ccc;">
                <option value="">-- Select Campus --</option>
                <option value="Campus A">Campus A</option>
                <option value="Campus B">Campus B</option>
            </select>
            <div id="campusHint" style="color:#e74c3c; font-size:.78rem; margin-top:4px; min-height:16px;"></div>
        </div>

        <div style="margin-bottom:16px;">
            <label style="display:block; font-weight:bold; margin-bottom:6px;">Room / Lab</label>
            <input
                type="text"
                name="room"
                id="roomInput"
                placeholder="e.g. Room 201, Lab 3"
                style="width:100%; padding:10px; border-radius:5px; border:1px solid #ccc;"
            >
            <div id="roomHint" style="color:#e74c3c; font-size:.78rem; margin-top:4px; min-height:16px;"></div>
        </div>

        <div style="margin-bottom:16px;">
            <label style="display:block; font-weight:bold; margin-bottom:6px;">Category</label>
            <select name="category" id="categorySelect"
                    style="width:100%; padding:10px; border-radius:5px; border:1px solid #ccc;">
                <option value="">-- Select Category --</option>
                <option value="Equipment">Equipment</option>
                <option value="Facility">Facility</option>
                <option value="Software">Software</option>
            </select>
            <div id="categoryHint" style="color:#e74c3c; font-size:.78rem; margin-top:4px; min-height:16px;"></div>
        </div>

        <div style="margin-bottom:16px;">
            <label style="display:block; font-weight:bold; margin-bottom:6px;">Description</label>
            <textarea
                name="description"
                id="descInput"
                rows="4"
                maxlength="500"
                placeholder="Describe the issue in detail..."
                style="width:100%; padding:10px; border-radius:5px; border:1px solid #ccc; resize:vertical;"
            ></textarea>
            <!-- Live character counter -->
            <div style="text-align:right; font-size:.75rem; color:#888; margin-top:3px;">
                <span id="charCount">0</span> / 500
            </div>
        </div>

        <div style="margin-bottom:20px;">
            <label style="display:block; font-weight:bold; margin-bottom:6px;">Priority</label>
            <div style="display:flex; gap:12px;">
                <?php foreach (['Low' => '#28a745', 'Medium' => '#f39c12', 'High' => '#e74c3c'] as $level => $color): ?>
                <label style="flex:1; text-align:center; cursor:pointer;">
                    <input type="radio" name="priority" value="<?php echo $level; ?>"
                           style="display:none;" class="priorityRadio">
                    <span class="priorityBtn" data-color="<?php echo $color; ?>" style="
                        display:block; padding:10px; border-radius:5px;
                        border:2px solid <?php echo $color; ?>;
                        color:<?php echo $color; ?>;
                        font-weight:bold;
                        transition: all .2s;
                        user-select: none;
                    ">
                        <?php echo $level; ?>
                    </span>
                </label>
                <?php endforeach; ?>
            </div>
            <div id="priorityHint" style="color:#e74c3c; font-size:.78rem; margin-top:6px; min-height:16px;"></div>
        </div>

        <button
            name="report"
            type="submit"
            style="width:100%; padding:12px; background:#2c5f2e; color:white;
                   border:none; border-radius:5px; font-size:1rem; cursor:pointer;
                   transition: background .2s;"
        >
            Submit Report
        </button>

    </form>
</div>

<script>
(function () {

    // ── Priority button toggle ────────────────────────────────────
    document.querySelectorAll('.priorityRadio').forEach(function (radio) {
        radio.addEventListener('change', function () {
            // Reset all buttons to outlined style
            document.querySelectorAll('.priorityBtn').forEach(function (btn) {
                btn.style.background = 'white';
                btn.style.color      = btn.dataset.color;
            });
            // Fill the selected button
            var btn = this.nextElementSibling;
            btn.style.background = btn.dataset.color;
            btn.style.color      = 'white';

            // Clear priority error when one is selected
            document.getElementById('priorityHint').textContent = '';
        });
    });

    // ── Live character counter on description ────────────────────
    var descInput = document.getElementById('descInput');
    var charCount = document.getElementById('charCount');

    descInput.addEventListener('input', function () {
        var len = this.value.length;
        charCount.textContent = len;
        // Turn counter red when close to the 500 limit
        charCount.style.color = len >= 450 ? '#e74c3c' : '#888';
    });

    // ── Clear field error on interaction ─────────────────────────
    document.getElementById('campusSelect').addEventListener('change', function () {
        document.getElementById('campusHint').textContent = '';
    });
    document.getElementById('roomInput').addEventListener('input', function () {
        document.getElementById('roomHint').textContent = '';
    });
    document.getElementById('categorySelect').addEventListener('change', function () {
        document.getElementById('categoryHint').textContent = '';
    });

    // ── Form validation before submit ────────────────────────────
    document.getElementById('issueForm').addEventListener('submit', function (e) {
        var valid = true;

        // Check campus
        if (!document.getElementById('campusSelect').value) {
            document.getElementById('campusHint').textContent = 'Please select a campus.';
            valid = false;
        }

        // Check room
        if (document.getElementById('roomInput').value.trim() === '') {
            document.getElementById('roomHint').textContent = 'Please enter the room or lab name.';
            valid = false;
        }

        // Check category
        if (!document.getElementById('categorySelect').value) {
            document.getElementById('categoryHint').textContent = 'Please select a category.';
            valid = false;
        }

        // Check priority — at least one radio must be selected
        var prioritySelected = document.querySelector('.priorityRadio:checked');
        if (!prioritySelected) {
            document.getElementById('priorityHint').textContent = 'Please select a priority level.';
            valid = false;
        }

        if (!valid) {
            e.preventDefault();
            return;
        }

        // Final confirm before submitting
        if (!confirm('Submit this issue report?')) {
            e.preventDefault();
        }
    });

}());
</script>

<?php include("../includes/footer.php"); ?>