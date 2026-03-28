package com.taskmanagement.backend.service;

import com.taskmanagement.backend.entity.Task;
import com.taskmanagement.backend.entity.User;
import com.taskmanagement.backend.repository.TaskRepository;
import com.taskmanagement.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    public Task createTask(Task task) {

        if (task.getStatus() == null) task.setStatus("TODO");

        if (task.getAssignedTo() != null && task.getAssignedTo().getId() != null) {
            User user = userRepository.findById(task.getAssignedTo().getId()).orElseThrow();
            task.setAssignedTo(user);
        }

        return taskRepository.save(task);
    }

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public List<Task> getTasksByStatus(String status) {
        return taskRepository.findByStatus(status);
    }

    public List<Task> getTasksByUser(Long userId) {
        return taskRepository.findByAssignedToId(userId);
    }

    public List<Task> getTasksByStatusAndUser(String status, Long userId) {
        return taskRepository.findByStatusAndAssignedToId(status, userId);
    }

    public Task updateTask(Long id, Task updated) {
        Task existing = taskRepository.findById(id).orElseThrow();

        if (updated.getTitle() != null) existing.setTitle(updated.getTitle());
        if (updated.getDescription() != null) existing.setDescription(updated.getDescription());
        if (updated.getStatus() != null) existing.setStatus(updated.getStatus());

        if (updated.getAssignedTo() != null && updated.getAssignedTo().getId() != null) {
            User user = userRepository.findById(updated.getAssignedTo().getId()).orElseThrow();
            existing.setAssignedTo(user);
        }

        return taskRepository.save(existing);
    }

    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }
}