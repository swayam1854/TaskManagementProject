package com.taskmanagement.backend.controller;

import com.taskmanagement.backend.entity.Task;
import com.taskmanagement.backend.entity.User;
import com.taskmanagement.backend.security.JwtUtil;
import com.taskmanagement.backend.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @GetMapping
    public List<Task> getTasks(
            @RequestHeader("Authorization") String token,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long assignedTo
    ) {

        String jwt = token.substring(7);

        String role = JwtUtil.extractRole(jwt);
        Long userId = JwtUtil.extractUserId(jwt);

        if (role.equals("ADMIN")) {
            if (status != null && assignedTo != null) {
                return taskService.getTasksByStatusAndUser(status, assignedTo);
            } else if (status != null) {
                return taskService.getTasksByStatus(status);
            } else if (assignedTo != null) {
                return taskService.getTasksByUser(assignedTo);
            } else {
                return taskService.getAllTasks();
            }
        }

        return taskService.getTasksByUser(userId);
    }


    @PostMapping
    public Task createTask(@RequestBody Task task,
                           @RequestHeader("Authorization") String token) {

        String jwt = token.substring(7);

        Long userId = JwtUtil.extractUserId(jwt);

        // Set createdBy user
        User creator = new User();
        creator.setId(userId);
        task.setCreatedBy(creator);

        return taskService.createTask(task);
    }

    @PutMapping("/{id}")
    public Task updateTask(@PathVariable Long id, @RequestBody Task task) {
        return taskService.updateTask(id, task);
    }

    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
    }
}